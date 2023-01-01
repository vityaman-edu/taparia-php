
export class Vector {
    constructor(public readonly x: number, public readonly y: number) { }

    toString() {
        return `(${this.x.toFixed(0)}, ${this.y.toFixed(0)})`
    }
}

export class Point extends Vector { }
export class Position extends Point { }
export class Direction extends Vector {}

export namespace Position {
    export function fromJson(json: Map<String, any>) {
        return new Position(json.get('x'), json.get('y'));
    }
}

export namespace Direction {
    export function fromJson(json: Map<String, any>) {
        return new Direction(json.get('x'), json.get('y'));
    }
}
