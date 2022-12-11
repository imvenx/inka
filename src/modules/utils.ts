import { start } from "repl"

export function roundToDecimals(decimals: 0 | 1 | 2 | 3 | 4 | 5 | 6, numberToRound: number) {
    return parseFloat(numberToRound.toFixed(decimals))
}

export const performanceTest = {
    t0: 0, t1: 0,
    start() { this.t0 = performance.now() },
    end() {
        this.t1 = performance.now()
        console.log('Took', (this.t1 - this.t0).toFixed(4), 'milliseconds')
    }

}