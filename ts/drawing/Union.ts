import { Drawable } from "./Drawable.js";

export class Union implements Drawable {
    constructor(private parts: Array<Drawable>) { }

    draw(ctx: CanvasRenderingContext2D): void {
        this.parts.forEach(part => part.draw(ctx))
    }
}