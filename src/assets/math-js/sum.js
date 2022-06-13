export default function sum(arr) {
    let allNumbers = arr.map(num => {
        if(num[0]=='-') {
            num = num.split("")
            num.shift()
            return num.map(v=> +v * -1)
        }else{
            return num.split("").map(v=> +v)
        }
    })
    //находим длинну самого длинного числа
    let longestLength = 0
    for (let i of allNumbers) {
        longestLength = i.length > longestLength ? i.length : longestLength
    }
    //добиваем остальные числа нулями
    allNumbers = allNumbers.map(v => {
        return v.length < longestLength ? [...new Array(longestLength - v.length).fill(0), ...v] : v
    })
    //console.log(allNumbers)
    //суммируем колонки
    let sumArr = []
    for (let x = 0; x < allNumbers[0].length; x++) {
        sumArr.push(allNumbers.map(function(v) {
            return v[x];
        }).reduce((a, b) => {
            return a + b;
        }));
    }
    let deferredTens = 0
    let result = ''
    while (sumArr.length != 0) {
        let currentSum = sumArr.pop() ?? 0
        result = currentSum % 10 + deferredTens + result
        deferredTens = currentSum > 9 ? Math.floor(currentSum / 10) : 0
    }
    if(result.length>1 && /[^0]/.test(result)) result = result.replace(/^0+/, '');
    return result
}