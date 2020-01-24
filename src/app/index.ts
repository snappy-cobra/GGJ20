import './style.css';

console.log("Hello, world!");


var gl : WebGL2RenderingContext;

function main() {
    var canvas = <any>document.querySelector("#glCanvas");
    gl = canvas.getContext("webgl2");
  
    if (gl === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
      return;
    }
  
    requestAnimationFrame(renderLoop)
}   


let oldTimeMS = 0;
let time = 0;

function renderLoop(timeMS : number) {  
    const deltaTime = (timeMS - oldTimeMS) / 1000;
    oldTimeMS = timeMS;
    time += deltaTime;
    
    gl.clearColor(Math.sin(time*1.0) * 0.4 + 0.6, 0.0, Math.sin(time*1.0) * 0.4 + 0.6, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    
    render(deltaTime);
    

    requestAnimationFrame(renderLoop)
}

function render(deltaTime : number) {
    // TODO: actually make a game
}


window.onload = main;