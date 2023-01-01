import { ColoredDrawable } from "./ColoredDrawable.js";
import { Drawable } from "./Drawable.js";
import { Collider } from "./geometry/index.js";

export class Polygon extends ColoredDrawable {
    constructor(private polygon: Collider.Polygon, color: Drawable.Color) {
        super(color);
    }

    _draw(ctx: CanvasRenderingContext2D) {
        var points = this.polygon.points;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
    }
};

