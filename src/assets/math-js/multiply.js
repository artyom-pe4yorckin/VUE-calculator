export default function multiply(arr) {
    //console.log(arr)
    if (arr.includes("0")) return "0"
    let isNegative = (arr.join("").match(/-/g) ?? "00").length % 2 != 0;
    arr = arr.map(v=>v.replace(/-/g, ""))
    let result = multiplyTwoNum(arr[0], arr[1])
    if(arr.length==2) return result
    /*
    перемножить цифры 2х чисел
    дополнить результат нулями
    просуммировать
    перемножить результат со следующим числом
    */
    for (let i = 2; i < arr.length; i++) {
        //перемножаем каждую цифру i+1го числа с каждой цифрой iго
        result = multiplyTwoNum(result, arr[i])
    }

    //возвращает массив с перемноженными числами
    function multiplyTwoNum(a,b){
        let subResult = []
        //Если после запятой только нули то удаляем их с точкой
        a = a.replace(/\.0+$/, "")
        b = b.replace(/\.0+$/, "")
        //получаем количество знаков после запятой
        let fractionalPartA = a.search(/\.\d+/)
        let fractionalPartB = b.search(/\.\d+/)
        let fractionalPart = (fractionalPartA==-1 ? 0 : a.length-fractionalPartA-1) + (fractionalPartB==-1 ? 0 : b.length-fractionalPartB-1)
        //Удаляем точки и нули в начале чисел
        a = a.replace(/\./, "")
        b = b.replace(/\./, "")
        a = a.replace(/^0+/, "")
        b = b.replace(/^0+/, "")

        //перемножаем каждую цифру i+1го числа с каждой цифрой iго
        for (let bDigit of b) {
            let multArr = []
            for (let aDigit of a) {
                multArr.push(bDigit * aDigit)
            }
            subResult.push(multArr)
        }
        subResult = subResult.reverse()
        //дополняем нулями
        for (let i = 0; i < subResult.length; i++) {
            subResult[i] = [...subResult[i], ...new Array(i).fill(0)]
        }
        let longestLength = Math.max(...subResult.map(v=>v.length))
        for (let i = 0; i < subResult.length; i++) {
            subResult[i] = [...new Array(longestLength-subResult[i].length).fill(0), ...subResult[i]]
        }
        //суммируем колонки
        let sumArr = []
        for (let x = 0; x < subResult[0].length; x++) {
            sumArr.push(subResult.map((v) => {
                return v[x];
            }).reduce((a, b) => {
                return a + b;
            }));
        }
        subResult = sumArr.reverse()
        //Двигаем десятки в полученом массиве чтоб получить резльтат перемножения
        for (let s = 0; s < subResult.length; s++) {
            if (subResult[s] >= 10) {
                subResult[s + 1] = subResult[s + 1] ?? 0
                subResult[s + 1] += Math.floor(subResult[s] / 10)
                subResult[s] = subResult[s] % 10
            }
        }
        subResult = subResult.reverse().join("")
        if(fractionalPart!=0){
            let dotPos = subResult.length - fractionalPart
            if(dotPos<0){
                return "0."+ new Array(-dotPos).fill(0).join('') + subResult
            }else if(dotPos==0){
                return "0."+ subResult
            }
            return subResult.substring(0, subResult.length-fractionalPart)+'.'+subResult.substring(subResult.length, subResult.length-fractionalPart)
        }else{
            return subResult
        }
    }

    return isNegative ? "-"+result : result
}