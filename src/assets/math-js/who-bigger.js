export function whoIsBigBoy(a, b) {
    let maxLength = Math.max(a.length, b.length)
    a = new Array(maxLength - a.length).fill(0).join("") + a
    b = new Array(maxLength - b.length).fill(0).join("") + b
    for (let i = 0; i < a.length; i++) {
        if (a[i] > b[i]) {
            return 'first'
        } else if (a[i] < b[i]) {
            return 'second'
        }
    }
    return 'equal'
}