import { Collider } from './Collider.js';
import { Point, Vector, Position } from '../primitive/Vector.js';

export class Ellipse extends Collider {
    constructor(
        public readonly center: Point,
        public readonly radius: Ellipse.Radius
    ) {
        super(Collider.Type.Ellipse);
    }

    contains(point: Point) {
        return Math.pow(point.x - this.center.x, 2) / Math.pow(this.radius.x, 2) +
            Math.pow(point.y - this.center.y, 2) / Math.pow(this.radius.y, 2) <= 1
    }
};

export namespace Ellipse {
    export class Radius extends Vector { }

    export namespace Radius {
        export function fromJson(json: Map<String, any>) {
            return new Radius(json.get('x'), json.get('y'));
        }
    }

    export function fromJson(json: Map<String, any>): Ellipse {
        return new Ellipse(
            Position.fromJson(json.get('center')),
            Radius.fromJson(json.get('radius'))
        )
    }
}
