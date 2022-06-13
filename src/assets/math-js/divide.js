import substract from '@/assets/math-js/substract'
import {whoIsBigBoy} from '@/assets/math-js/who-bigger'

export default function divide(a, b) {
    //console.log("Исходные числа ", a, b)
    if(+a==0) return "0"
    if(+b==0) return Infinity
    if (+b == 1) return a
    let addedDigitsCnt = 0
    /*
    Делаем дробные числа целыми путём домножения да 10^длинна_дробной_части
     */
    a = a.replace(/,/g, ".")
    b = b.replace(/,/g, ".")
    //Math.max((a.match(afterDotRegex)??[""])[0].length + b.match(afterDotRegex)??[""][0].length)
    if(a.includes(".") && b.includes(".")){
        let aFractional = a.match(/\.\d+/g)[0].length - 1
        let bFractional = b.match(/\.\d+/g)[0].length - 1
        let maxFractional = Math.max(aFractional, bFractional)
        a = a+new Array(maxFractional - aFractional).fill(0).join("")
        b = b+new Array(maxFractional - bFractional).fill(0).join("")
        a = a.replace(/\./g, "").replace(/^0+/, "")
        b = b.replace(/\./g, "").replace(/^0+/g, "")
    }else if (a.includes(".") && !b.includes(".")){
        let aFractional = a.match(/\.\d+/g)[0].length - 1
        a= a.replace(/^0+/, "")
        a= a.replace(/\./g, "")
        b = b+new Array(aFractional).fill(0).join("")
    }else if(!a.includes(".") && b.includes(".")){
        let bFractional = b.match(/\.\d+/g)[0].length - 1
        b= b.replace(/^0+/, "")
        b= b.replace(/\./g, "")
        a = a+new Array(bFractional).fill(0).join("")
    }
    //console.log("После пеервода из дробных в целые", a, b)
    /*
    * Если b>a то домножаем a на 10^n чтобы a было больше
    * потом в ответе просто ставим точку в нужном месте
    * */
    if (b.length > a.length) {
        addedDigitsCnt += b.length - a.length + 1//прибавляем на 1 десяток больше т.к. числа равной длины могут быть не равны
        a = a+new Array(b.length - a.length+1).fill(0).join("")
    } else if (b.length == a.length) {
        //если длины чисел одинаковы то находим большее
        if(whoIsBigBoy(a,b)==="second"){
            addedDigitsCnt += 1
            a = a+"0"
        }
    }
    //console.log("После того как сделали a>b", a, b)
    //console.log("Количество добавленных десятков", addedDigitsCnt)

    //a-b пока остаток >0, возвращает остаток и количество итераций
    function subDivide(a, b) {
        let cnt = 1
        let remainder = substract(a, b)
        while (remainder > 0) {
            let sub = substract(remainder, b)
            if (sub < 0) {
                return {cnt: cnt, remainder: remainder}
            }
            cnt++
            remainder = sub
        }
        return {cnt: cnt, remainder: remainder}
    }

    a = a.split("")
    b = b.split("")
    let pieceLength = b.length
    /*
    * Взять кусок слева из a равный длинне b
    * 1 Вычесть кусок a из b
    * 1.1 Если результат <0 то добавить к куску a ещё 1 цифру
    * 2 Записать в ответ сколько b в куске a, остаток + следующая цифра a будет следующим куском
    * */
    let result = ""
    let piece = a.slice(0, pieceLength).join("")//то из чего вычитаем b
    while (a.length != 0 && result.length<6) {
        /*
        * Получаем кусок
        * Вычитаем из куска b
        * если кусок=0 то в result добавляется 0
        * или кусок<b то в result добавляется 0
        * записываем сколько b в куске в ответ
        * удаляем кусок из a
        * кусок = остаток + след. цифра
        * */
        //если цифра 1го числа =0 то добавляем 0 в результат
        if (+piece == 0) {
            result += "0"
            piece = a[1]
            a.splice(0, 1)
            continue
        }
        //если b>куска то добавляем к куску ещё одну цифру из a
        //если цифр в а больше нет то добавляем 0 в а
        let bigBoy = whoIsBigBoy(piece, b)
        if (bigBoy == "second") {
            result += "0"
            piece = piece.split("")
            if(a[pieceLength]){
                piece[piece.length] = a[pieceLength]
            }else{
                if(!result.match(/\./g)) result += "."
                piece[piece.length] = "0"
            }
            piece = piece.join("")
            pieceLength++
        }
        //вычитаем из куска b
        let howMany = subDivide(piece, b.join(""))
        //записываем в ответ сколько b в текущем куске
        result += howMany.cnt
        //удаляем кусок из a
        a.splice(0, pieceLength)
        //обновляем кусок
        piece = howMany.remainder + (a[0] ?? "")
        //если у a кончились цифры и остаток меньше b то умножить остаток на 10
        if(a.length==0 && whoIsBigBoy(piece,b.join(""))=="second" && piece!=0){
            if(!result.match(/\./g)) result += "."
            if(whoIsBigBoy(piece+"0", b.join(""))=="second"){
                piece = piece+"00"
                a.push("0", "0")
                result+=0
            }else{
                piece = piece+"0"
                a.push("0")
            }
        }
    }
    //console.log(result)
    //вставляем разделитель дробной части
    result = result.split("")

    if(addedDigitsCnt!=0){
        let dotPos = result.indexOf(".")==-1 ? 0 : result.indexOf(".")
        let newDotPos = dotPos-addedDigitsCnt
        if(dotPos==0){
            result = [...new Array(addedDigitsCnt).fill(0), ...result]
            newDotPos = 1
        }
        if(newDotPos<0){
            result = [...new Array(-newDotPos+1).fill(0), ...result]
            dotPos = result.indexOf(".")==-1 ? 0 : result.indexOf(".")
            newDotPos = Math.abs(dotPos-addedDigitsCnt)
        }
        //console.log(dotPos, newDotPos)
        if(dotPos!=0){
            result.splice(dotPos, 1)
        }
        //console.log(result)
        result.splice(newDotPos, 0, ".")
        if(result[0]==".") result.unshift("0")
        return result.join("").replace(/^0(?!\.)/g, "")
    }
    return result.join("").replace(/^0(?!\.)/g, "")
}