import { Drawable } from "./drawing/index.js";
import { Collider, Point } from "./drawing/geometry/index.js";
import { Utility } from "./Utility.js";

const BACKGROUND = '#FFF'
const MAIN = '#77F'

export class Target extends Collider.Collider implements Drawable.Drawable {
    public constructor(
        private out: Collider.Polygon,
        private circle: Collider.Ellipse,
        private rectangle: Collider.Polygon,
        private triangle: Collider.Polygon,
        private additionalPolygons: Array<Collider.Polygon>
    ) {
        super(Collider.Collider.Type.Union)
    }

    area(): Collider.Collider {
        return Collider.Collider.union(
            this.out.inversed().and(this.circle),
            this.rectangle,
            this.triangle,
            ...this.additionalPolygons
        )
    }

    drawable(): Drawable.Drawable {
        return new Drawable.Union([
            new Drawable.Ellipse(this.circle, MAIN),
            new Drawable.Polygon(this.out, BACKGROUND),
            new Drawable.Polygon(this.rectangle, MAIN),
            new Drawable.Polygon(this.triangle, MAIN),
            ...this.additionalPolygons.map((p, _i, _a) => {
                return new Drawable.Polygon(p, MAIN);
            })
        ])
    }

    contains(point: Point): boolean {
        return this.area().contains(point) 
            || Collider.Collider.union(...this.additionalPolygons).contains(point)
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.drawable().draw(ctx);
    }
}

export namespace Target {
    export function parseObject(object: Object) {
        const json = Utility.deepConvertToMap(object);
        return parseJson(json);
    }

    export function parseJson(json: Map<String, any>) {
        const main = json.get('main') as Map<String, any>;
        const additional = json.get('additional') as Array<Map<String, any>>;
        return parseCollider(
            Collider.Factory.fromJson(main),
            additional.map((p, _i, _a) => {
                return Collider.Factory.fromJson(p) as Collider.Polygon
            })
        )
    }

    export function parseCollider(
        area: Collider.Collider, 
        additionalPolygons: Array<Collider.Polygon>
    ): Target {
        const root = area as Collider.Collider.Union
        const intersection = root.parts[0] as Collider.Collider.Intersection
        const inversed = intersection.parts[0] as Collider.Collider.Inversed
        const out = inversed.inner as Collider.Polygon
        const circle = intersection.parts[1] as Collider.Ellipse
        const rectangle = root.parts[1] as Collider.Polygon
        const triangle = root.parts[2] as Collider.Polygon
        return new Target(out, circle, rectangle, triangle, additionalPolygons)
    }
}