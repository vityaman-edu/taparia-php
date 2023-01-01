import { Point } from "./drawing/geometry/primitive/Vector.js";

export class ResultTable {
    private table: HTMLTableElement

    constructor(table: HTMLTableElement) {
        this.table = table
    }

    append(entry: ResultTable.Entry) {
        entry.appendTo(this.table)
    }
}

export namespace ResultTable {
    export class Entry {
        constructor(
            private currentTime: number,
            private status: Entry.Status,
            private point: Point,
            private latency: number,
        ) {}

        /**
         * <tr>
         *   <td>17:34</td>
         *   <td>(10, 21)</td>
         *   <td>HIT</td>
         *   <td>0.001</td>
         * </tr>
         */
        appendTo(table: HTMLTableElement) {
            const row = table.insertRow(1)
            row.insertCell(0).innerHTML = this.currentTimeAsString()
            row.insertCell(1).innerHTML = this.status.toString()
            row.insertCell(2).innerHTML = this.point.toString()
            row.insertCell(3).innerHTML = this.latency.toString()
        }

        private currentTimeAsString() {
            const date = new Date(this.currentTime * 1000)
            var hours = date.getHours()
            var minutes = "0" + date.getMinutes()
            var seconds = "0" + date.getSeconds()
            var formattedTime = 
                hours + ':' + minutes.slice(-2) + ':' + seconds.slice(-2)
            return formattedTime;
        }
    }

    export namespace Entry {
        export class Status {
            constructor(private text: string) {}

            toString() { return this.text }
        }

        export namespace Status {
            export function hit() {
                return new Status("HIT")
            }

            export function miss() {
                return new Status("MISS")
            }

            export function error(text: string) {
                return new Status(text)
            }
        }
            
    }
}