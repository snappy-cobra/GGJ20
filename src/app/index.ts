import './style.css';
import {DrawTile} from './model/drawtile';
import {Game} from './model/Game';
import {ShaderProgram} from './util/shaderprogram';
import {Texture} from './util/texture';

var gl : WebGL2RenderingContext;

import tileVertexCode from './shaders/tile.vert'
import tileFragmentCode from './shaders/tile.frag'
import cursorVertexCode from './shaders/cursor.vert'
import corsorFragmentCode from './shaders/cursor.frag'
import main_texture_path from '../images/texture.png'

let defaultShader : ShaderProgram;
let cursorShader : ShaderProgram;
var game : Game = new Game(20, 20, null, null);


function main() {
    var canvas = <any>document.getElementById("glCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    gl = canvas.getContext("webgl2");
    if (gl === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
      return;
    }

    start();

    requestAnimationFrame(renderLoop)
}   

function resize() {
    var canvas = <any>document.getElementById("glCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0,  window.innerWidth, window.innerHeight);
}


let oldTimeMS = 0;
let time = 0;

function renderLoop(timeMS : number) {  
    update();

    const deltaTime = (timeMS - oldTimeMS) / 1000;
    oldTimeMS = timeMS;
    time += deltaTime;
    
    gl.clearColor(Math.sin(time*2.0)*0.4 + 0.6,  0.5,  Math.cos(time*2.0)*0.4 + 0.6, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    
    render(deltaTime);
    

    requestAnimationFrame(renderLoop)
}

function glInit() {   
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Design desission
    let a = 1/Math.sqrt(3);
    let b = 0.5;
    let c = a*0.5;
    let vertices = new Float32Array([
        // x   y    z
        0.0, 0.0, 0.0,
        0.0,  a, 0.0,
          b,  c, 0.0,
          b, -c, 0.0,
        0.0, -a, 0.0,
         -b, -c, 0.0,
         -b,  c, 0.0,
    ]);

    let indicies = new Int16Array([
        // x   y    z
        1, 2, 0, 
        2, 3, 0, 
        3, 4, 0, 
        4, 5, 0,
        5, 6, 0,
        6, 1, 0 
    ]);

    let vbo : WebGLBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    let ibo : WebGLBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicies, gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
}

function start() {   
    glInit();

    defaultShader = new ShaderProgram(gl, tileVertexCode, tileFragmentCode);
    cursorShader = new ShaderProgram(gl, cursorVertexCode, corsorFragmentCode);

    var main_texture : Texture = new Texture(gl, main_texture_path);
}


function update() {
    game.update();
}

function setMVP(shader : ShaderProgram, x : number, y : number, z:number=0) {
    if (Math.abs(y) % 2 == 1)
        x += 0.5
    y *= Math.sqrt(3/4);

    let MVP = new Float32Array([
          s,   0, 0, 0,
          0,   s, 0, 0,
          0,   0, s, 0,
        x*s, y*s, z, 1,
    ]);

    gl.uniformMatrix4fv(shader.unformLocation(gl, "MVP"), false, MVP); 
}

const s : number = 0.1;
function drawHex(x : number, y : number, type : DrawTile) {
    setMVP(defaultShader, x, y);
    gl.uniform1f(defaultShader.unformLocation(gl, "u_tile"), type.type);
    gl.drawElements(gl.TRIANGLES, 3*6, gl.UNSIGNED_SHORT, 0);
}


function render(deltaTime : number) {
    
    defaultShader.use(gl);
    let view = game.view();
    for(let x: number=0; x<view.width; x++) {
        for(let y: number=0; y<view.height; y++) {
            drawHex(x - 0.5 * view.width, y - 0.5 * view.height, view.tiles[x][y]);
        }
    }
    
    cursorShader.use(gl);
    setMVP(cursorShader, game.cursor.position.x, game.cursor.position.y, 1);
    gl.drawElements(gl.TRIANGLES, 3*6, gl.UNSIGNED_SHORT, 0);
}


window.onresize = resize;
window.onload = main;
