import multiply from '@/assets/math-js/multiply'
export default function factorial(num) {
    if(+num==0) return 1
    let arr = []
    for (let i=1;i<=+num;i++){
        arr.push(i+"")
    }
    return multiply(arr)
}