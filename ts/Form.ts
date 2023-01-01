
export class Form {
    private readonly form: HTMLFormElement
    private readonly x: () => HTMLInputElement
    private readonly y: HTMLInputElement
    private readonly r: HTMLInputElement

    constructor(id: string) {
        this.generateXRadioButtons(id)
        this.form = document.getElementById(id + "-form") as HTMLFormElement
        this.x = () => document.querySelector(
            `input[name="${id}-x"]:checked`) as HTMLInputElement
        this.y = document.getElementById(id + "-y") as HTMLInputElement
        this.r = document.getElementById(id + "-r") as HTMLInputElement

        this.y.addEventListener('input', (event) => {
            if (this.y.value == "" || Form.isValidY(this.y.value)) {
                this.y.style.backgroundColor = 'white';
            } else {
                this.y.style.backgroundColor = '#f44336';
            }
        });

        this.r.addEventListener('input', (event) => {
            if (this.y.value == "" || Form.isValidR(this.r.value)) {
                this.r.style.backgroundColor = 'white';
            } else {
                this.r.style.backgroundColor = '#f44336';
            }
        });
    }

    setOnSubmitAction(action: (_: Form.CheckPositionParameters) => void) {
        this.form.onsubmit = _ => {
            _.preventDefault()

            const x = Number.parseFloat(this.x().value)

            if (!Form.isValidY(this.y.value)) return
            const y = Number.parseFloat(this.y.value)

            if (!Form.isValidR(this.r.value)) return
            const r = Number.parseFloat(this.r.value)

            action([x * 40, y * 40, r * 40])
        }
    }

    private static isValidY(y: string): boolean {
        const number = Number(y)
        return !isNaN(number) && -3 < number && number < 5
    }

    private static isValidR(r: string): boolean {
        const number = Number(r)
        return !isNaN(number) && 2 < number && number < 5
    }

    private generateXRadioButtons(id: string) {
        const div = document.getElementById(id + '-x-values')
        for (var x = -4; x <= 4; x++) {
            const stringX =
                (x <= 0) ? x.toString() : ' ' + x.toString()

            const input = document.createElement('input')
            input.setAttribute('type', 'radio')
            input.setAttribute('id', `${id}-${stringX}`)
            input.setAttribute('name', `${id}-x`)
            input.setAttribute('value', stringX)

            const label = document.createElement('label')
            label.setAttribute('for', stringX)
            label.textContent = stringX

            div.appendChild(input)
            div.appendChild(label)

            if (x == -1) {
                input.checked = true
                div.appendChild(document.createElement('br'))
            }
        }
    }
}

export namespace Form {
    export type CheckPositionParameters = [number, number, number]
}