import { Collider } from './Collider.js';
import { Ellipse } from './Ellipse.js';
import { Polygon } from './Polygon.js';

export namespace Factory {
    export function fromJson(json: Map<String, any>): Collider {
        switch (json.get('type')) {
            case 'ellipse':
                return Ellipse.fromJson(json)
            case 'polygon':
                return Polygon.fromJson(json)
            case 'intersection':
                return intersectionFromJson(json)
            case 'union':
                return unionFromJson(json)
            case 'inverse':
                return inverseFromJson(json)
            default:
                throw new Error('type ' + json.get('type') + ' is not supported')
        }
    }

    function intersectionFromJson(json: Map<String, any>) {
        return Collider.intersection(
            ...((json.get('parts') as Array<Map<String, any>>).map(fromJson))
        )
    }

    function unionFromJson(json: Map<String, any>) {
        return Collider.union(
            ...((json.get('parts') as Array<Map<String, any>>).map(fromJson))
        )
    }

    function inverseFromJson(json: Map<String, any>) {
        return Collider.inversed(
            fromJson(json.get('inner') as Map<String, any>)
        )
    }
}
