precision mediump float;

varying vec2 vTexCoord;
uniform float u_time;
uniform float u_beat;
uniform vec2 u_resolution;
uniform sampler2D u_tex;
uniform sampler2D ui_tex;

// Bundled at build time via vite-plugin-glsl; VS Code warnings are expected.
#include "./utils/math.frag"
#include "./utils/coord.frag"
#include "./utils/color.frag"

void main(void) {
    vec2 iuv = vTexCoord;

    iuv += random(iuv) * 0.1 - 0.05;

    vec2 uv = iuv;

    uv -= vec2(0.5);
    uv *= 2.0;
    uv = xy2pol(uv);
    uv.x += uv.y * PI * 2.0 + u_time * 0.1;
    uv = pol2xy(uv);
    uv += vec2(0.5);

    uv = kaleidoscope(uv, 8.0, u_resolution);

    // uv.y += sin(uv.x * PI * 10.0 + u_time * 10.0) * 0.1 * map(zigzag((u_beat + 0.5) * 0.5), 0.0, 1.0, 0.5, 1.0);
    // uv.x = 0.5;

    uv = scaleUV(uv, 1.0);

    vec4 col = texture2D(u_tex, uv);

    col = rgbShift(u_tex, uv, 0.05);

    if(abs(iuv.x - 0.5) < 0.2){
        col.rgb = invert(col.rgb);
    }

    vec2 uuv = vTexCoord;
    uuv += random(uuv) * 0.0006 - 0.0003;
    vec4 uiCol = texture2D(ui_tex, uuv);
    col = mix(col, uiCol, uiCol.a);

    gl_FragColor = col;
}