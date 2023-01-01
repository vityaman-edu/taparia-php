import { ColoredDrawable } from './ColoredDrawable.js';
import { Drawable } from './Drawable.js';
import { Segment as GSegment } from './geometry/index.js';

export class Segment extends ColoredDrawable {
    constructor(
        private segment: GSegment,
        private width: number,
        color: Drawable.Color
    ) {
        super(color)
    }

    _draw(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.segment.start.x, this.segment.start.y);
        ctx.lineTo(this.segment.end.x, this.segment.end.y);
        ctx.stroke();
    }
}