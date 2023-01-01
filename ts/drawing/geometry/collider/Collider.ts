import { Point } from '../primitive/Vector.js';

export abstract class Collider {
    constructor(
        public readonly type: Collider.Type
    ) { }

    abstract contains(point: Point): boolean

    and(other: Collider): Collider {
        return Collider.intersection(this, other)
    }

    or(other: Collider): Collider {
        return Collider.union(this, other)
    }

    inversed(): Collider {
        return Collider.inversed(this)
    }
}

export namespace Collider {
    export enum Type {
        Ellipse = 'ellipse',
        Polygon = 'polygon',
        Union = 'union',
        Inversed = 'inverse',
        Intersection = 'intersection'
    }

    export function union(...colliders: Collider[]): Collider {
        return new Union(colliders)
    }

    export function intersection(...colliders: Collider[]): Collider {
        return new Intersection(colliders)
    }

    export function inversed(collider: Collider): Collider {
        return new Inversed(collider)
    }

    export class Intersection extends Collider {
        constructor(
            public readonly parts: Array<Collider>
        ) {
            super(Collider.Type.Intersection)
        }

        contains(point: Point): boolean {
            return this
                .parts
                .every(part => part.contains(point))
        }
    }

    export class Inversed extends Collider {
        constructor(
            public readonly inner: Collider
        ) {
            super(Collider.Type.Inversed)
        }

        contains(point: Point): boolean {
            return !this.inner.contains(point)
        }
    }

    export namespace Inversed {
        export function fromObject(collider: Collider) {
            return collider as Inversed;
        }
    }

    export class Union extends Collider {
        constructor(
            public readonly parts: Array<Collider>
        ) {
            super(Collider.Type.Union)
        }

        contains(point: Point): boolean {
            return this
                .parts
                .some(part => part.contains(point))
        }
    }

    export namespace Union {
        export function fromObject(collider: Collider) {
            return collider as Union;
        }
    }
}
