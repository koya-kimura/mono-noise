import type { VisualRenderContext } from "../types/render";
import { map } from "../utils/math/mathUtils";
import { zigzag } from "../utils/math/mathUtils";
import { UniformRandom } from "../utils/math/UniformRandom";

export class MultLine {
    draw(ctx: VisualRenderContext): void {
        const { p, tex, midiManager, beat, audioManager, captureManager, font } = ctx;

        tex.push();

        const scl = [2.0, 0.0625][midiManager.midiInput["circleSize"] as number];
        const n = map(UniformRandom.rand(Math.floor(beat)), 0, 1, 5, 10);
        for (let i = 0; i < n; i++) {
            const angle = UniformRandom.rand(Math.floor(beat), i) * Math.PI * 2;
            const radius = Math.max(tex.width, tex.height) * Math.sqrt(2);
            const cx = tex.width * map(UniformRandom.rand(Math.floor(beat), i), 0, 1, 0.2, 0.8);
            const cy = tex.height * map(UniformRandom.rand(Math.floor(beat), i), 0, 1, 0.2, 0.8);
            const x1 = cx + Math.cos(angle) * radius;
            const y1 = cy + Math.sin(angle) * radius;
            const x2 = cx + Math.cos(angle + Math.PI) * radius;
            const y2 = cy + Math.sin(angle + Math.PI) * radius;

            const m = Math.floor(map(UniformRandom.rand(Math.floor(beat), i), 0, 1, 500, 2000) * scl);
            for (let j = 0; j < m; j++) {
                const x = map(j, 0, m, x1, x2);
                const y = map(j, 0, m, y1, y2);
                const s = map(zigzag(beat + UniformRandom.rand(Math.floor(beat), i)), 0, 1, 0.99, 1.0) * map(Math.pow(UniformRandom.rand(Math.floor(beat), i), 2), 0, 1, 0.035, 0.045) * map(Math.sin(j * 0.33) * Math.cos(i * 0.47) * p.noise(j * 0.03, i * 0.02), -1, 1, 0.4, 1.5) * Math.min(tex.width, tex.height) * 500 / m;
                const a = map(Math.pow(p.noise(j * 2.0, i * 0.7), 2), 0, 1, 255, -1000);

                if (a > 0) {
                    tex.strokeWeight(s);
                    tex.stroke(250, a);
                    tex.point(x, y);
                }
            }
        }

        tex.pop();
    }
}