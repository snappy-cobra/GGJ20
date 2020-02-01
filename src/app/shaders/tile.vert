#version 300 es
layout (location=0) in vec3 a_pos;

uniform mediump float u_tile;
uniform mat4 MVP;

out vec2 texcoord;

const float NUM_TILES = 8.0;

void main(void) {
    gl_Position = MVP * vec4(a_pos, 1.0);
    texcoord = (a_pos.xy * sqrt(3.0) + vec2(1.0)) *  vec2(0.5 / NUM_TILES) + vec2(u_tile/NUM_TILES, 0.0);
    texcoord.y *= -1.0;
    texcoord.y += (1.0/NUM_TILES);
}