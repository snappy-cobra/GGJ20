#version 300 es
layout (location=0) in vec3 a_pos;

uniform mediump float u_time; // required to have it in both the frag and vert shader
uniform float u_tile;
uniform mat4 MVP;
uniform vec3 u_force;

out vec3 v_pos;
out vec2 texcoord;

const float NUM_TILES = 8.0;
const float zoom = 0.9;

void main(void) {
    u_force.xy
    vec3 pos = a_pos + max(u_force.z - u_time, 0) * vec3(u_force.xy, 0);

    gl_Position = MVP * vec4(pos, 1.0);
    float x = mod(u_tile/NUM_TILES, 1.0);
    float y = floor(u_tile/NUM_TILES) / NUM_TILES;
    texcoord = (a_pos.xy * zoom * sqrt(3.0) + vec2(1.0)) *  vec2(0.5 / NUM_TILES) + vec2(x, 0);
    texcoord.y *= -1.0;
    texcoord.y -= (7.0 - floor(u_tile/NUM_TILES))/8.0;
    v_pos = a_pos;
}