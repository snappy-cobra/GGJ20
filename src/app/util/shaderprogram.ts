export class ShaderProgram {

    shaderProgram : WebGLProgram;

    constructor(gl : WebGL2RenderingContext, vertexCode : string, fragmentCode : string) {
        var vertexShader : WebGLShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexCode);
        gl.compileShader(vertexShader);
        
        var fragmentShader : WebGLShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentCode);
        gl.compileShader(fragmentShader);

        this.shaderProgram = gl.createProgram();
        gl.attachShader(this.shaderProgram, vertexShader);   
        gl.attachShader(this.shaderProgram, fragmentShader);   
        gl.linkProgram(this.shaderProgram);
        gl.detachShader(this.shaderProgram, vertexShader);
        gl.detachShader(this.shaderProgram, fragmentShader);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        // if something in our 2 shaders is incorrect it will not link
        if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
            console.error([
                gl.getProgramInfoLog(this.shaderProgram), 
                gl.getShaderInfoLog(vertexShader), 
                gl.getShaderInfoLog(fragmentShader)
            ]);
        }
    }

    public use(gl : WebGL2RenderingContext) {
        gl.useProgram(this.shaderProgram);
    }
}
