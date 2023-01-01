import { Collider } from './Collider.js';
import { Segment } from '../primitive/Segment.js';
import { Point, Position } from '../primitive/Vector.js'

export class Polygon extends Collider {
    private static CORNER = new Point(999, 999)

    constructor(
        public readonly points: Array<Point>
    ) {
        super(Collider.Type.Polygon);
    }

    contains(point: Point) {
        const ray = new Segment(point, Polygon.CORNER)
        return this
            .sides()
            .filter(side => side.intersects(ray))
            .length % 2 == 1
    }

    private sides() {
        const result = []
        for (var i = 1; i <= this.points.length; i++) {
            result.push(
                new Segment(
                    this.points[i - 1],
                    this.points[i % this.points.length]
                )
            )
        }
        return result;
    }
}

export namespace Polygon {
    export function fromJson(json: Map<String, any>): Polygon {
        return new Polygon(
            (json.get('points') as Array<Map<String, number>>)
                .map(Position.fromJson)
        )
    }
}