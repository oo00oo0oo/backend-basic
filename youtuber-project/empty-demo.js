const obj1 = {}
const obj2 = {message:'not empty'}
const num1 = 1

//문자열도 객체다.
const str1 = "one"
const str2 = ""

console.log(isEmpty(obj1)) 
console.log(isEmpty(obj2)) 
console.log(isEmpty(num1)) 
console.log(isEmpty(str1)) 
console.log(isEmpty(str2)) 

const str = "Hello";
console.log(Object.keys(str)); // TypeError: Object.keys called on non-object


// 1. string은 원시값이지만, Object.prototype을 사용하면, 자동으로 래퍼 객체로 변환되어서 사용이 가능하다.
// 2. object.keys를 사용하면, string 래퍼 객체의 경우, 각 요소의 인덱스 값이 반환된다.
// 3. 비록, string이 래퍼 객체로 자동으로 엔진이 변환해주지만, 우리가 직접 정적으로 타입 변환 후에, 코드를 실행하는 것이 가독성에 좋고 실수할 확률이 적다.



// obj 타입부터 확인 후, Number라면, 그에 맞는 리턴값 주기
// num은 Number 생성자 함수에 의해서 생성되고, 생성되면서 prototype 프로퍼티에 정의된 모든 속성과 메서드
// 상속받음, 그 중에 하나가 constructor 프로퍼티(객체를 생성한 생성자 함수를 가르키는 참조 프로퍼티)
// 따라서, 만약에 obj에 숫자값이 들어오면, obj.constructor를 했을 경우, Number가 나오게 됨

// 객체 키 값의 길이를 확인해주는 함수
function isEmpty(obj){
    if(obj.constructor === Number){
        return `typeof obj is number`;
    }

    if (Object.keys(obj).length === 0){
        return true;
    } else {
        return false
    }
}