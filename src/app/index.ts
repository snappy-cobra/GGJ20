import './style.css';
import {Game} from './model/Game';
import {ShaderProgram} from './util/shaderprogram';
import {Texture} from './util/texture';
import {mat4, vec3} from 'gl-matrix';

var gl : WebGL2RenderingContext;
var canvas : any;
var started: boolean = false;

import tileVertexCode from './shaders/tile.vert'
import tileFragmentCode from './shaders/tile.frag'
import cursorVertexCode from './shaders/cursor.vert'
import cursorFragmentCode from './shaders/cursor.frag'
import introCloudVertexCode from './shaders/introcloud.vert'
import introCloudFragmentCode from './shaders/introcloud.frag'
import main_texture_path from '../images/texture.png'
import { TextureType, Tile } from './model/Tile';

let defaultShader : ShaderProgram;
let cursorShader : ShaderProgram;
let introCloudShader : ShaderProgram;
var game : Game = new Game(30, 20, null, null);


function main() {
    canvas = <any>document.getElementById("glCanvas");
    gl = canvas.getContext("webgl2");
    resize();
    
    if (gl === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
      return;
    }

    start();
    requestAnimationFrame(renderLoop);
}   

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}


let oldTimeMS = 0;
let absoluteTime = 0;
let time = 0;


function renderLoop(timeMS : number) {  
    const deltaTime = (timeMS - oldTimeMS) / 1000;
    oldTimeMS = timeMS;
    absoluteTime += deltaTime;
    if (started) time += deltaTime;
    
    gl.clearColor(104.0/255.0, 182.0/255.0, 220.0/255.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    render((started)? time : 0.0);
    if (started) update(deltaTime);

    requestAnimationFrame(renderLoop)
}

function glInit() {   
    gl.enable(gl.DEPTH_TEST)
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
    cursorShader = new ShaderProgram(gl, cursorVertexCode, cursorFragmentCode);
    introCloudShader = new ShaderProgram(gl, introCloudVertexCode, introCloudFragmentCode);

    var main_texture : Texture = new Texture(gl, main_texture_path);
}


function update(deltaTime : number) {
    game.update(deltaTime);
}

const s : number = 0.2;
function setMVP(shader : ShaderProgram, x : number, y : number, z:number=0) {
    x -= 15;
    y -= 10;
    if (Math.abs(y) % 2 == 1)
        x += 0.5
    y *= Math.sqrt(3/4);

    var MVP: mat4 = mat4.create();
    var ratio = canvas.width/canvas.height;
    // mat4.ortho(MVP, -1*ratio, 1*ratio, -1, 1, -100, 100);
    mat4.perspective(MVP, 45.0, ratio, 0.1, 100);
    mat4.translate(MVP, MVP, [x*s,y*s,z-4]);
    mat4.scale(MVP, MVP, [s,s,s]);

    gl.uniformMatrix4fv(shader.unformLocation(gl, "MVP"), false, MVP); 
}

function drawHex(x : number, y : number, tile : Tile) {
    setMVP(defaultShader, x, y);
    gl.uniform1f(defaultShader.unformLocation(gl, "u_tile"), tile.type);
    gl.uniform2f(defaultShader.unformLocation(gl, "u_animation"), tile.animStrength[0], tile.animStrength[1]);

    gl.drawElements(gl.TRIANGLES, 3*6, gl.UNSIGNED_SHORT, 0);
}


function render(time : number) {
    defaultShader.use(gl);
    gl.uniform1f(defaultShader.unformLocation(gl, "u_time"), time);
    
    let view = game.view();
    for(let x: number=0; x<view.width; x++) {
        for(let y: number=0; y<view.height; y++) {
            drawHex(x, y, view.tiles[x][y]);
        }
    }
    

    cursorShader.use(gl);
    setMVP(cursorShader, game.cursor.position.x, game.cursor.position.y, 0.001);
    gl.drawElements(gl.TRIANGLES, 3*6, gl.UNSIGNED_SHORT, 0);
    
    if (time < 10.0) { // INTRO done;
        introCloudShader.use(gl);
        gl.uniform1f(introCloudShader.unformLocation(gl, "u_time"), absoluteTime);

        var MVP: mat4 = mat4.create();
        var ratio = canvas.width/canvas.height;
        mat4.perspective(MVP, 45.0, ratio, 0.1, 100);
        mat4.translate(MVP, MVP, [0.0, 0, -3.0 + time * 0.5]);
        mat4.scale(MVP, MVP, [10.0,10.0,10.0]);

        gl.uniformMatrix4fv(introCloudShader.unformLocation(gl, "MVP"), false, MVP); 
        gl.drawElements(gl.TRIANGLES, 3*6, gl.UNSIGNED_SHORT, 0);
    }
}

window.onresize = resize;
window.onload = main;

if (true) {
    document.getElementById("main_menu").classList.add("hidden");
    started = true;
}
else {
    document.getElementById("start_button").addEventListener("click", () => {
        document.getElementById("main_menu").classList.add("hidden");
        started = true;
    });
}
