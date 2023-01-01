import { Drawable } from './drawing/index.js';
import { Collider } from './drawing/geometry/index.js';
import { Point, Position, Segment } from './drawing/geometry/index.js';

const INF = 999

export class CoordinatesDrawable implements Drawable.Drawable {
    private origin = new Drawable.Union([
        new Drawable.Segment(
            new Segment(
                new Point(-INF, 0),
                new Point(INF, 0)
            ),
            2,
            '#A00'
        ),
        new Drawable.Segment(
            new Segment(
                new Point(0, -INF),
                new Point(0, INF)
            ),
            2,
            '#A00'
        ),
        new Drawable.Ellipse(
            new Collider.Ellipse(
                new Point(0, 0),
                new Collider.Ellipse.Radius(3, 3)
            ),
            '#00F'
        )
    ])

    draw(ctx: CanvasRenderingContext2D): void {
        this.origin.draw(ctx);
    }

}