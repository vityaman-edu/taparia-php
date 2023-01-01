import { Collider } from "./drawing/geometry/index.js";
import { Drawable } from "./drawing/index.js";
import { Target } from "./Target.js";
import { Point as PPoint } from "./drawing/geometry/primitive/Vector.js";
import { CoordinatesDrawable } from "./CoordinatesDrawable.js";

export class Battlefield implements Drawable.Drawable {
    private readonly coordinates = new CoordinatesDrawable()
    private points: Array<Battlefield.Point>

    public constructor(
        private r: number,
        private target: Target
    ) {
        this.points = []
        this.updateTarget(r, target)
    }
    
    public updateTarget(r: number, taget: Target) {
        this.target = taget
        if (this.r != r) {
            this.r = r
            this.points = []
        }
    }

    public addPoint(point: Battlefield.Point) {
        this.points.push(point)
    }

    public tap(point: PPoint) {
        this.uncheckedTap(point, this.target.contains(point))
    }

    public uncheckedTap(point: PPoint, isHit: boolean) {
        this.points.push(
            (isHit) 
                ? Battlefield.Point.hit(point) 
                : Battlefield.Point.miss(point)
        )   
    }

    public targetRadius() {
        return this.r;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.clearCanvas(ctx)
        this.target.draw(ctx)
        this.coordinates.draw(ctx)
        this.points.forEach(p => p.draw(ctx))
    }

    private clearCanvas(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = '#FFF';
        ctx.clearRect(-1000, -1000, 2 * 1000, 2 * 1000);
    }
}

export namespace Battlefield {
    export class Point extends Drawable.Ellipse {
        constructor(
            point: PPoint, 
            color: Drawable.Drawable.Color
        ) { 
            super(
                new Collider.Ellipse(
                    point,
                    new Collider.Ellipse.Radius(Point.R, Point.R)
                ),
                color
            )
        }

        _draw(ctx: CanvasRenderingContext2D): void {
            super._draw(ctx)
        }
    }

    export namespace Point {
        export const SUCCEED = '#0F0'
        export const FAILED = '#F00'
        export const R = 4

        export function hit(point: PPoint) {
            return new Point(point, SUCCEED);
        }

        export function miss(point: PPoint) {
            return new Point(point, FAILED);
        }
    }
}