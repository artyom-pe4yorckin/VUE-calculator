import {whoIsBigBoy} from '@/assets/math-js/who-bigger'

export default function substract(a, b) {
    //console.log("вычитание", a,b)
    let result = []
    a = a.split("").map(v => +v)
    b = b.split("").map(v => +v)
    //Вычитаем всегда из большего меньший (a-b)
    let isNegative = false
    if (a.length > b.length) {
        b = [...new Array(a.length - b.length).fill(0), ...b]
    } else if (a.length < b.length) {
        //если длинна 2го числа больше значит само число больше
        a = [...new Array(b.length - a.length).fill(0), ...a]
        isNegative = true
        let c = b
        b = a
        a = c
    } else {
        //если длины чисел одинаковы то находим большее
        let bigBoy = whoIsBigBoy(a,b)
        if(bigBoy == 'equal'){
            return "0"
        }else if(bigBoy == "second"){
            isNegative = true
            let c = b
            b = a
            a = c
        }
    }
    //console.log(a,b)
    for (let i = 0; i < a.length; i++) {
        result.push(+a[i] - +b[i])
    }
    shiftDozens()

    function shiftDozens() {
        for (let i = 0; i < result.length - 1; i++) {
            if (result[i] >= 0 && result[i + 1] < 0) {
                result[i]--
                result[i + 1] += 10
            }
        }
        if (result.some(v => v < 0)) {
            shiftDozens()
        }
    }

    result = result.join("").replace(/^0+/, "")
    return isNegative ? "-" + result : result
}