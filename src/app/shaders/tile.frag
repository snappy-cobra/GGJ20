#version 300 es
precision mediump float;

uniform sampler2D u_texture;
uniform mediump float u_time; // required to have it in both the frag and vert shader
uniform vec2 u_animation;
uniform vec4 u_color;

in vec3 v_pos;
in vec2 texcoord;
out vec4 fragColor;



// https://thebookofshaders.com/11/
// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
    vec2(12.9898,78.233)))
    * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);
    //     u = smoothstep(0.,1.,f);

    return mix(a, b, u.x) +
    (c - a)* u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

const float animationStrength = 0.005;
void main() {
    vec2 distortion = vec2(noise(texcoord + u_time * u_animation) -0.5, noise(texcoord + u_time * u_animation) -0.5) * 2.0 * animationStrength * u_animation;

    float f = pow(v_pos.x, 2.0) + pow(v_pos.y, 2.0);

    fragColor = texture(u_texture, texcoord + distortion);
    
    if (fragColor.r + fragColor.b > 1.9 && fragColor.g < 0.1)
        discard;
    else 
        fragColor -= vec4(f,f,f, 0.0);

    fragColor.x = mix(fragColor.x, u_color.x, u_color.w);
    fragColor.y = mix(fragColor.y, u_color.y, u_color.w);
    fragColor.z = mix(fragColor.z, u_color.z, u_color.w);
}