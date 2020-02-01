#version 300 es
precision mediump float;

out vec4 fragColor;
in vec3 v_pos;

void main() {
    float f = pow(v_pos.x, 2.0) + pow(v_pos.y, 2.0);
    fragColor = vec4(1.0, 1.0, 1.0, 3.0*f);
}