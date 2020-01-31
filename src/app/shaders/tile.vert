#version 300 es
layout (location=0) in vec3 a_pos;

uniform float u_tile;

out vec2 texcoord;

void main(void) {
    gl_Position = vec4(a_pos, 1.0);
    texcoord = (a_pos.xy + vec2(1.0)) *  vec2(0.25, 0.5) + vec2(0.5 * u_tile, 0.0);
    texcoord.y *= -1.0;
}