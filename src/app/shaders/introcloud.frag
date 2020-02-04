#version 300 es
precision mediump float;

out vec4 fragColor;
in vec2 v_pos;
in vec4 v_MVPpos;

uniform float u_time;

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
const int FBM_OCTAVES = 3;
const float H = 1.5;

// http://iquilezles.org/www/articles/fbm/fbm.htm
float fbm(vec2 x)
{
    float G = exp2(-H);
    float f = 1.0;
    float a = 1.0;
    float t = 0.0;
    for( int i=0; i<FBM_OCTAVES; i++ )
    {
        t += a*noise(f*x);
        f *= 2.0;
        a *= G;
    }
    return t;
}

float pattern( vec2 p, float t)
{
    vec2 q = vec2( fbm( p + vec2(t, 0) ), fbm( p + vec2(5.2,1.3)) );

    return fbm( p + 1.5 * q ) * 0.7;
}

void main() {
    float f = pattern(v_MVPpos.xy, u_time * 0.5);
    f /= 3.0;
    f += 0.66;

    fragColor = vec4(f, f, f, f) + vec4(0.0, 0.0, 0.0, v_MVPpos.z - 2.0);
}