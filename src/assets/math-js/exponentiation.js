import multiply from '@/assets/math-js/multiply'

export default function exponentiation(a, b) {
    if(b=="0") return "1"
    if(a=="0") return "0"
    if(b=="1") return a
    if(a.match(/^\d+/)[0].length>3 || b.match(/^\d+/)[0].length>3) return Infinity
    if(+a<14 && +b<14) return a**b+""
    let arr = new Array(+b).fill(a)
    //console.log(arr)
    return multiply(arr)
}