#version 300 es
layout (location=0) in vec3 a_pos;

uniform mediump float u_tile;
uniform mat4 MVP;

out vec3 v_pos;
out vec2 texcoord;

const float NUM_TILES = 8.0;
const float zoom = 0.9;

void main(void) {
    gl_Position = MVP * vec4(a_pos, 1.0);
    float x = mod(u_tile/NUM_TILES, 1.0);
    float y = floor(u_tile/NUM_TILES) / NUM_TILES;
    texcoord = (a_pos.xy * zoom * sqrt(3.0) + vec2(1.0)) *  vec2(0.5 / NUM_TILES) + vec2(x, 0);
    texcoord.y *= -1.0;
    texcoord.y -= (7.0 - floor(u_tile/NUM_TILES))/8.0;
    v_pos = a_pos;
}