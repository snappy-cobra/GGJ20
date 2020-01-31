import './style.css';
import {ShaderProgram} from './util/shaderprogram';
import * as Model from './model/model2';


var gl : WebGL2RenderingContext;

let vertexCode : string = "#version 300 es\n"+
    "layout (location=0) in vec3 a_pos;" +

    "uniform mat4 MVP;" +

    "void main() {" +
        "gl_Position = MVP * vec4(a_pos, 1.0);" +
    "}";
    
let fragmentCode : string = "#version 300 es\n"+
    "precision mediump float;"+
    "out vec4 fragColor;"+
    "uniform vec4 u_color;"+
    "void main() {"+
        "fragColor = u_color;"+
    "}";

let defaultShader : ShaderProgram;


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
    const deltaTime = (timeMS - oldTimeMS) / 1000;
    oldTimeMS = timeMS;
    time += deltaTime;
    
    gl.clearColor(Math.sin(time*2.0)*0.4 + 0.6,  0.5,  Math.cos(time*2.0)*0.4 + 0.6, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    
    render(deltaTime);
    

    requestAnimationFrame(renderLoop)
}



function start() {   
    defaultShader = new ShaderProgram(gl, vertexCode, fragmentCode);
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

const s : number = 0.1;
function drawHex(x : number, y : number, type : Model.Tile) {
    
    if (Math.abs(y) % 2 == 1)
        x += 0.5
    y *= Math.sqrt(3/4);
    
    let MVP = new Float32Array([
        s,0,0,0,
        0,s,0,0,
        0,0,s,0,
        x*s,y*s,0,1,
    ]);

    
    gl.uniformMatrix4fv(defaultShader.unformLocation(gl, "MVP"), false, MVP);
    gl.uniform4f(defaultShader.unformLocation(gl, "u_color"), type.type, 0, 0, 1);
    gl.drawElements(gl.TRIANGLES, 3*6, gl.UNSIGNED_SHORT, 0);
}


var model : Model.MooieCode = new Model.MooieCode(); 
function render(deltaTime : number) {

    defaultShader.use(gl);

    for(let x=0; x<model.width; x++) {
        for(let y=0; y<model.height; y++) {
            drawHex(x-0.5*model.width, y-0.5*model.height, model.tiles[x][y]);
        }
    }
}


window.onresize = resize;
window.onload = main;