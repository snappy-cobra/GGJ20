import './style.css';
import {Game} from './model/Game';
import {ShaderProgram} from './util/shaderprogram';
import {Texture} from './util/texture';
import {mat4, vec3} from 'gl-matrix';

var gl : WebGL2RenderingContext;
var canvas : any;
var livesCount: number = 3;

import tileVertexCode from './shaders/tile.vert'
import tileFragmentCode from './shaders/tile.frag'
import cursorVertexCode from './shaders/cursor.vert'
import cursorFragmentCode from './shaders/cursor.frag'
import introCloudVertexCode from './shaders/introcloud.vert'
import introCloudFragmentCode from './shaders/introcloud.frag'
import main_texture_path from '../images/texture.png'
import { TextureType, Tile } from './model/Tile';
import {MetaGame} from "./model/MetaGame";

let defaultShader : ShaderProgram;
let cursorShader : ShaderProgram;
let introCloudShader : ShaderProgram;
let gameWidth = 30;
let gameHeight = 20;
var metaGame : MetaGame = new MetaGame(gameWidth, gameHeight);

enum GameState {
    MENU,
    PLAYING,
    GAMEOVER
}
var gameState: GameState = GameState.MENU;


/****************************************************************************** Main */ 

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

function gameOver() {
    gameState = GameState.GAMEOVER;
    document.getElementById("gameover").classList.remove("hidden");
}


/****************************************************************************** Render Loop */ 
let oldTimeMS = 0;
let absoluteTime = 0;
let time = 0;

function renderLoop(timeMS : number) {  
    const deltaTime = (timeMS - oldTimeMS) / 1000;
    oldTimeMS = timeMS;
    absoluteTime += deltaTime;
    if (gameState == GameState.PLAYING) time += deltaTime;
    
    gl.clearColor(104.0/255.0, 182.0/255.0, 220.0/255.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    render((gameState == GameState.PLAYING)? time : 0.0);
    if (gameState == GameState.PLAYING) update(deltaTime);

    requestAnimationFrame(renderLoop)
}


/******************************************************************************  Start */ 
function start() {   
    glInit();

    defaultShader = new ShaderProgram(gl, tileVertexCode, tileFragmentCode);
    cursorShader = new ShaderProgram(gl, cursorVertexCode, cursorFragmentCode);
    introCloudShader = new ShaderProgram(gl, introCloudVertexCode, introCloudFragmentCode);

    var main_texture : Texture = new Texture(gl, main_texture_path);
}

function glInit() {   
    // gl.enable(gl.DEPTH_TEST)
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

/******************************************************************************  Update */ 

function update(deltaTime : number) {
    if (metaGame.lives < livesCount) {
        var livesDom = document.getElementById("lives");
        livesCount -= 1;
        livesDom.removeChild(livesDom.children[livesCount]);

        if (livesCount <= 0) { gameOver(); }
    }
    metaGame.update(deltaTime);
}

/******************************************************************************  Render */ 

const s : number = 0.2;
function setMVP(shader : ShaderProgram, x : number, y : number, z:number=0) {
    x -= gameWidth/2;
    y -= gameHeight/2;
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

function drawHex(x : number, y : number, z : number, tile : Tile) {
    setMVP(defaultShader, x, y, z);
    gl.uniform1f(defaultShader.unformLocation(gl, "u_tile"), tile.type);
    gl.uniform2f(defaultShader.unformLocation(gl, "u_animation"), tile.animStrength[0], tile.animStrength[1]);

    gl.drawElements(gl.TRIANGLES, 3*6, gl.UNSIGNED_SHORT, 0);
}


var bgTile : Tile = new Tile("bg", 0, TextureType.Water);
function render(time : number) {
    let game = metaGame.cur_game;

    defaultShader.use(gl);
    gl.uniform1f(defaultShader.unformLocation(gl, "u_time"), time);
    
    let view = game.view();
    for(let x: number=-20; x<view.width+20; x++) { // TODO: overdraw
        for(let y: number=-20; y<view.height+20; y++) {
            drawHex(x, y, -0.01 + Math.max(2-time, 0), bgTile);
        }
    }
    for(let x: number=0; x<view.width; x++) {
        for(let y: number=0; y<view.height; y++) {
            drawHex(x, y, Math.max(2-time, 0), view.tiles[x][y]);
        }
    }
    
    if (time >= 2.2) {
        cursorShader.use(gl);
        setMVP(cursorShader, game.cursor.position.x, game.cursor.position.y, 0.001);
        gl.uniform1f(cursorShader.unformLocation(gl, "u_time"), time);
        gl.drawElements(gl.TRIANGLES, 3*6, gl.UNSIGNED_SHORT, 0);
    }

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


/******************************************************************************  EVENTS */ 

window.onresize = resize;
window.onload = main;

if (false) {
    document.getElementById("main_menu").classList.add("hidden");
    gameState = GameState.PLAYING;
}

document.getElementById("start_button").addEventListener("click", () => {
    document.getElementById("main_menu").classList.add("hidden");
    document.getElementById("lives").classList.remove("hidden");
    gameState = GameState.PLAYING;
});

document.getElementById("restart_button").addEventListener("click", () => {
    document.getElementById("gameover").classList.add("hidden");
    document.getElementById("lives").classList.remove("hidden");

    metaGame.new_world();
    time = 0;

    livesCount = 3;
    for (let i=0; i<livesCount; i++) {
        var node = document.createElement("div");
        node.classList.add('live');
        document.getElementById("lives").appendChild(node);
    }
    gameState = GameState.PLAYING;
});
