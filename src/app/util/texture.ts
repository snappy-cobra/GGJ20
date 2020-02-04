export class Texture {

    texture : WebGLTexture;

    constructor(gl : WebGL2RenderingContext, image_path : string) {
        this.texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + 0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

        var image : HTMLImageElement = new Image();
        image.addEventListener('load', () => {
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            // Wrapping
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); // gl.REPEAT or gl.MIRRORED_REPEAT or gl.CLAMP_TO_EDGE or gl.CLAMP_TO_BORDER
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

            // Filtering
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // gl.NEAREST or gl.LINEAR
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // gl.NEAREST_MIPMAP_NEAREST or gl.LINEAR_MIPMAP_NEAREST, gl.NEAREST_MIPMAP_LINEAR or gl.LINEAR_MIPMAP_LINEAR

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        });
        image.src = image_path;
    }

    bind(gl : WebGL2RenderingContext) {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
}