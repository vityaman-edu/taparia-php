
export interface Drawable {
    draw(ctx: CanvasRenderingContext2D): void
}

export namespace Drawable {
    export type Color = string | CanvasGradient | CanvasPattern;
}

