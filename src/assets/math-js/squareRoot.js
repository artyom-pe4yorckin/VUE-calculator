import divide from "@/assets/math-js/divide";
import exponentiation from "@/assets/math-js/exponentiation";
export default function sqrt(a, b) {
    //console.log(a,b)
    if(+b<2) return a
    //return 10**(Math.log10(a)/b)
    function minusOne(a){
        return a.substring(0, a.length-1) + +a.substring(a.length-1, a.length)-1
    }

    let eps = 0.000001;     //допустимая погрешность
    let x = a/b;  //начальное приближение корня
    let prevx = a; // текущее значение
    while(Math.abs(x-prevx)>eps){
        prevx = x
        x = (1/b)*(minusOne(b+'')*prevx+(a/(prevx**minusOne(b+''))));
        //console.log(Math.abs(x-prevx))
    }
    return x;
}