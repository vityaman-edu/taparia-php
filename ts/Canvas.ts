import { Drawable } from "./drawing/index.js";
import { Point, Position } from "./drawing/geometry/index.js";
import { Vector } from "./drawing/geometry/primitive/Vector.js";

type MouseEventCallback = (mousePosition: Position) => void

export class Canvas {
    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly origin: Point
    ) { }

    draw(drawable: Drawable.Drawable): Canvas {
        const ctx = this.canvas.getContext("2d")
        ctx.save();
        ctx.translate(this.origin.x, this.origin.y)
        ctx.scale(1, -1)
        drawable.draw(ctx)
        ctx.restore()
        return this;
    }

    setMouseClickListener(callback: MouseEventCallback): Canvas {
        this.canvas.onclick = ((e: MouseEvent) => {
            const mousePosition = new Point(e.clientX, e.clientY)
            callback(this.translate(mousePosition))
        }).bind(this)
        return this;
    }

    private translate(point: Point) {
        const topLeftCorner = this.topLeftCorner()
        return new Point(
            point.x - topLeftCorner.x - this.origin.x,
            -(point.y - topLeftCorner.y - this.origin.y)
        )
    }

    private topLeftCorner(): Position {
        const rectangle = this.canvas.getBoundingClientRect();
        return new Position(rectangle.left, rectangle.top)
    }
}
