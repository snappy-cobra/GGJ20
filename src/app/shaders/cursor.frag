#version 300 es
precision mediump float;

out vec4 fragColor;
in vec3 v_pos;

uniform float u_time;

void main() {
    float f = pow(v_pos.x, 2.0) + pow(v_pos.y, 2.0);
    float t = abs(sin(u_time * 5.0)) / 4.0 + 0.75;
    fragColor = vec4(t, t, t, 3.0*f);
}