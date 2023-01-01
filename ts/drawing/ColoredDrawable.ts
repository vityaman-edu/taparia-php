import { Drawable } from "./Drawable.js";

export abstract class ColoredDrawable implements Drawable {
    constructor(
        private readonly color: Drawable.Color
    ) { }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        this._draw(ctx);
        ctx.fill();
    }

    abstract _draw(ctx: CanvasRenderingContext2D): void
}