import './style.css';
import {modelmain} from './model/model';

var gl : WebGL2RenderingContext;

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
    
    modelmain()
    return;
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
    var vertexCode : string = "#version 300 es\n"+
        "layout (location=0) in vec3 a_pos;" +
                    
        "void main(void) {" +
            "gl_Position = vec4(a_pos, 1.0);" +
        "}";

    var vertexShader : WebGLShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexCode);
    gl.compileShader(vertexShader);
    
    var fragmentCode : string = "#version 300 es\n"+
        "precision mediump float;"+
        "out vec4 fragColor;"+
        "void main() {"+
            "fragColor = vec4(1.0, 0.0, 1.0, 1.0);"+
        "}";

    var fragmentShader : WebGLShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentCode);
    gl.compileShader(fragmentShader);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);   
    gl.attachShader(shaderProgram, fragmentShader);   
    gl.linkProgram(shaderProgram);
    gl.detachShader(shaderProgram, vertexShader);
    gl.detachShader(shaderProgram, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    // if something in our 2 shaders is incorrect it will not link
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error([
            gl.getProgramInfoLog(shaderProgram), 
            gl.getShaderInfoLog(vertexShader), 
            gl.getShaderInfoLog(fragmentShader)
        ]);
    }

    gl.useProgram(shaderProgram);


    var vertices = new Float32Array([
        // x   y    z
        -0.6, -0.6, 0.0,
        0.6, -0.6, 0.0,
        0.0,  0.6, 0.0,
    ]);

    var vbo : WebGLBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

}

function render(deltaTime : number) {

    // draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3); 
}


window.onresize = resize;
window.onload = main;
