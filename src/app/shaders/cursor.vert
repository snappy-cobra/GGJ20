#version 300 es
layout (location=0) in vec3 a_pos;

uniform mat4 MVP;

out vec3 v_pos;

void main(void) {
    gl_Position = MVP * vec4(a_pos, 1.0);
    v_pos = a_pos;
}