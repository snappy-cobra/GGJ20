#version 300 es
layout (location=0) in vec3 a_pos;

uniform mat4 MVP;
out vec2 v_pos;
out vec4 v_MVPpos;

void main(void) {
    v_pos = a_pos.xy;
    v_MVPpos = MVP * vec4(a_pos, 1.0);
    gl_Position = v_MVPpos;
}