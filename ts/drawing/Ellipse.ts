import { ColoredDrawable } from "./ColoredDrawable.js";
import { Drawable } from "./Drawable.js";
import { Collider } from "./geometry/index.js";

export class Ellipse extends ColoredDrawable {
    constructor(
        private readonly ellipse: Collider.Ellipse,
        color: Drawable.Color 
    ) {
        super(color)
    }

    _draw(ctx: CanvasRenderingContext2D) {
        var ellipse = this.ellipse;
        ctx.beginPath();
        ctx.ellipse(
            ellipse.center.x,
            ellipse.center.y,
            ellipse.radius.x,
            ellipse.radius.y,
            0, 0, 2 * Math.PI
        );
        ctx.stroke();
    }
};