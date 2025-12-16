precision mediump float;

varying vec2 vTexCoord;
uniform float u_time;
uniform float u_beat;
uniform vec2 u_resolution;
uniform sampler2D u_tex;
uniform sampler2D ui_tex;
uniform float u_faderValues[9];
uniform bool u_red;

// Bundled at build time via vite-plugin-glsl; VS Code warnings are expected.
#include "./utils/math.frag"
#include "./utils/coord.frag"
#include "./utils/color.frag"
#include "./utils/midi.frag"

void main(void) {
    vec2 iuv = vTexCoord;

    if(getFaderValue(0) == 1.0){
        iuv += vec2(random(iuv * 57209.42789) * 0.1 - 0.05, random(iuv * 8789.47289) * 0.1 - 0.05);
    }

    vec2 uv = iuv;

    uv -= vec2(0.5);
    uv = xy2pol(uv);
    if(getFaderValue(3) == 1.0){
        uv.x += uv.y * PI * 3.0 + u_time * 0.1;
    }
    uv = pol2xy(uv);
    uv += vec2(0.5);
    if(getFaderValue(4) == 1.0){
        uv = kaleidoscope(uv, 16.0, u_resolution);
    }

    if(getFaderValue(2) == 1.0){
        uv.y += sin(uv.x * PI * 10.0 + u_time * 10.0) * 0.1 * map(zigzag((u_beat + 0.5) * 0.5), 0.0, 1.0, 0.5, 1.0);
    }

    if(getFaderValue(1) == 1.0){
        uv.x = mod(floor(random(vec2(floor(u_beat))) * 10.0), 10.0) / 10.0;
    }

    uv = scaleUV(uv, 1.0);

    vec4 col = texture2D(u_tex, uv);

    if(getFaderValue(7) == 1.0){
        col = rgbShift(u_tex, uv, 0.02);
    }

    col.rgb *= getFaderValue(8);

    if(u_red && gray(col.rgb) > 0.0){
        col.rgb = vec3(1.0, 0.0, 0.0);
    }

    gl_FragColor = col;
}