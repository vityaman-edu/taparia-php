import { Battlefield } from './Battlefield.js';
import { Canvas } from './Canvas.js';
import { Collider } from './drawing/geometry/index.js';
import { Point, Position } from './drawing/geometry/index.js';
import { Form } from './Form.js';
import { ResultTable } from './ResultTable.js';
import { Target } from './Target.js';
import { Utility } from './Utility.js';

const DEFAULT_R = 200

var battlefield: Battlefield = null
function getTarget(r: number) {
    $.ajax({
        type: 'GET',
        url: "../php/api/getTarget.php",
        dataType: "json",
        data: `r=${r}`,
        timeout: 1500,
        success: function (data: Object) {
            const target = Target.parseObject(data)
            battlefield = new Battlefield(r, target)
            canvas.draw(battlefield)
        },
        error: function (request, status, error) {
            console.error("error: " + error)
            console.error("response: " + request.responseText)
        }
    });
}
getTarget(DEFAULT_R);

$.ajax({
    type: 'GET',
    url: "../php/api/getResults.php",
    dataType: "json",
    timeout: 1500,
    success: function (data: Object) {
        console.log(data)
        const response = Utility.deepConvertToMap(data);
        const results = response.get('results') as Array<Map<String, any>>
        console.log("results: " + results)
        results.forEach(r => {
            const point = new Point(r.get('x') as number, r.get('y') as number)
            const isHit = r.get('hit') as boolean
            table.append(new ResultTable.Entry(
                r.get('current_time') as number,
                (isHit) 
                    ? ResultTable.Entry.Status.hit()
                    : ResultTable.Entry.Status.miss(),
                point,
                r.get('latency') as number,
            ))

            // TODO: killer feature - save points 
            // battlefield.addPoint(
            //     (isHit) 
            //         ? Battlefield.Point.hit(point)
            //         : Battlefield.Point.miss(point)
            // )
        });
    },
    error: function (request, status, error) {
        console.error("error: " + error)
        console.error("response: " + request.responseText)
    }
});

const table = new ResultTable(
    document.getElementById("result-table") as HTMLTableElement
)

const checkHitClickListener = (position: Position) => {
    checkHit([position.x, position.y, battlefield.targetRadius()])
}

const addRectClickListener = (position: Position) => {
    const x = position.x
    const y = position.y
    $.ajax({
        type: 'POST',
        url: "../php/api/additionalRectangle.php",
        data: {
            'rect': {
                'points': [
                    {'x': x,       'y': y      },
                    {'x': x + 50,  'y': y      },
                    {'x': x + 50,  'y': y - 50},
                    {'x': x,       'y': y - 50},
                ]
            }
        },
        timeout: 1500,
        success: function (data: Object) {
            getTarget(battlefield.targetRadius())
        },
        error: function (request, status, error) {
            getTarget(battlefield.targetRadius())
            console.error("error: " + error)
            console.error("response: " + request.responseText)
        }
    });
}

const modes = [
    checkHitClickListener,
    addRectClickListener
]

var i = 0
document.getElementById('switch-mode').onclick = (e) => {
    canvas.setMouseClickListener(modes[++i % 2])
}

const canvas = new Canvas(
    document.getElementById('canvas') as HTMLCanvasElement,
    new Point(250, 250)
)
canvas.setMouseClickListener(checkHitClickListener)

const form = new Form('check-position')
form.setOnSubmitAction(checkHit)

function checkHit(params: Form.CheckPositionParameters) {
    $.ajax({
        type: 'POST',
        url: "../php/api/tap.php",
        timeout: 1500,
        dataType: "json",
        data: {
            'x': params[0],
            'y': params[1],
            'r': params[2]
        },
        success: function (data: Object) {
            const response = Utility.deepConvertToMap(data);
            const targetJson = response.get('target') as Map<String, any>
            const target = Target.parseJson(targetJson);
            const hit = response.get('hit') as boolean
            const currentTime = response.get('current_time') as number
            const latency = response.get('latency') as number
            const point = new Position(params[0], params[1])
            
            table.append(
                new ResultTable.Entry(
                    currentTime,
                    (hit) 
                        ? ResultTable.Entry.Status.hit()
                        : ResultTable.Entry.Status.miss(),
                    point,
                    latency
                )
            )
            
            battlefield.updateTarget(params[2], target)
            battlefield.uncheckedTap(point, hit)
            canvas.draw(battlefield)
        },
        error: function (request, status, error) {
            console.error("error: " + error)
            console.error("response: " + request.responseText)
            table.append(
                new ResultTable.Entry(
                    (new Date()).getUTCMilliseconds(),
                    ResultTable.Entry.Status.error(status), 
                    new Point(params[0], params[1]),
                    666
                )
            )
        }
    });
}