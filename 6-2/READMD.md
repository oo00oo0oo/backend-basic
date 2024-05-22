## 1. next()

### 1.1 방법1 - 미들웨어X → 함수 호출

validate 변수를 생성해서 미들웨어로 사용하지 않고,

그냥 함수로 제작 후 각 api에서 호출하는 형태로 사용하면, 에러 발생하지 않음

1. 유효성 검사 함수 생성

```jsx
function validate(req, res){
    const err = validationResult(req)

    if(!err.isEmpty()){
        return res.status(400).json(err.array())
    }
}
```

1. 함수 호출

```
.get([body('userId').notEmpty().isInt().withMessage('숫자입력필요')]
    ,(req,res)=>{
        validate(req,res)
        
```

### 1.2 방법2 - 미들웨어 사용 + next()로 유효성 검사 통과 후 해야할 일 알려주기

1. 매개변수로 next 추가
2. 만약, 유효성 검사 통과 시, 즉 err가 없을 시, return next()

```jsx
const validate = (req, res, next)=>{
    const err = validationResult(req)

    if(!err.isEmpty()){
        return res.status(400).json(err.array())
    } else {
        return next(); // 다음 할 일 하러 찾으러 가봐!
    }
}
```

```jsx
.get([body('userId').notEmpty().isInt().withMessage('숫자입력필요'),validate]
    ,(req,res, next)=>{

```

## 2. 인증과 인가

> 인증
> 

== 로그인

> 인가
> 

인증이 되었다고 해도,권한에 따라서 접근 가능한 페이지가 다름

어디까지 권한 가능한지 확인하는 것이 인가

인증 이후 인가

## 3. 쿠키 세션 차이

로그인 유지에 필요한 개념으로 쿠키와 세션이 있음!

### 3.1 쿠키

사이트에 한번 로그인하면 일정 기간동안은 로그인이 유지됨

다른 페이지로 이동해도 로그인 정보가 유지됨

이걸 가능하게 하는 방법으로 쿠키가 있는 것!

포춘 쿠키를 생각하자!

포춘 쿠키 안에 메시지를 담은 종이가 있듯이, 쿠키에도 필요한 정보를 담겨있음

로그인을 하면, 서버가 로그인 정보를 담은 쿠키를 구워줌

새로운 페이지에 갈때 이 쿠키를 서버에게 전달하면, 서버가 확인 후, 처리를 함

> 장점
> 
1. 서버 저장 공간 절약
    1. 서버가 로그인 정보를 서버 저장공간에 저장하는 게 아니라서, 서버 저장 공간을 아낄 수 있다.
2. stateless하다, 따라서 RESTful하다

<aside>
⭐ stateless?

</aside>

서버-클라이언트 구조에서 서버가 클라이언트 상태를 가지고 있지 않는 거

> 단점
> 
1. 보안에 취약하다
    1. 누군가 사용자와 서버 사이의 쿠키를 가로채서 정보를 훔쳐볼 수 있음

### 3.2 세션

쿠키의 단점(보안에 취약)을 극복하기 위해서 세션이 탄생함

로그인 시, 서버는 서버 공간에 금고를 만들어서 정보를 보관 후, 

그 서버 공간에 접근할 수 있는 금고 번호를 사용자에게 줌

사용자와 서버는 번호만을 가지고 대화를 진행

> 장점
> 
1.  보안
    1. 금고에 정보를 보관하니, 보안이 쿠키에 비해서 비교적 좋다.

> 단점
> 
1. 서버에 정보를 저장한다.
    1. 서버에 정보를 보관하니, 서버 저장 공간을 사용하게 된다.
2. 서버에 저장하니, stateless하지 못하다.(not RESTful)

## 4. JWT

### 4.1 JWT 개념

쿠키도, 세션도 단점이 존재하니, JWT가 탄생하게 된다.

JSON WEB TOKEN의 약자

JSON 형태로 데이터를 안전하게 전송하기 위한 토큰(웹에서 사용)이다.

옛날옛적 사용되던 버스 토큰을 생각하면 이해하기 쉽다.

버스를 타기 위해서는 버스 토큰이라는 게 필요했고, 버스토큰은 학생/성인용으로 나누어져있었음

이와 비슷하게 JWT도, 서버에게 사용자가 자신이 인증된 사용자라는 걸 ‘증명’하기 위한 수단으로 사용됨

또한, 버스토큰이 학생/성인으로 구분된 것처럼, 

JWT도 관리자/일반 유저 권한을 구분함

결국, 두 가지에 대한 토큰인 것

1. (인증용) 입장 가능한 유저라는 것

2. (인가용) 관리자 권한, 일반 유저 권한인지 

### 4.2 장점

1. 암호화가 되어있기에, 보안에 강하다
2. HTTP 특징을 잘 따르기에 Stateless하다. (’서버가 상태를 저장하지 않음’)
3. 서버 저장 공간 절약, 서버 부담 줄여줌

### 4.3 구조

[JWT.IO](https://jwt.io/)

![1](./img/6-2-1.png)

JWT는 header, payroad, signature의 구조를 가짐

> 헤더
> 

토큰 타입(jwt), 암호화 알고리즘 명시

> 페이로드
> 

사용자 정보, 전달하는 데이터

데이터 각각의 key는 claim

→ 페이로드는 a set of claim임

> 시그니처
> 

헤더와 페이로드가 변조되었는지 확인하는 역할

페이로드를 수정하면 시그니처도 자동으로 수정됨 

JWT는 헤더, 페이로드, 시그니처 이 세 파트를 각각 인코딩해서 생성됨

```jsx
const token = base64urlEncoding(header) 
+ '.' + base64urlEncoding(payload) 
+ '.' + base64urlEncoding(signature)
```

### 4.4 인증-인가 절차

![1](./img/6-2-2.png)

> 첫 요청
> 
1. 클라이언트 → 서버

로그인 요청

post / login

body(username, password)

1. 서버

내부 로직 확인

내부 로직 통과 → JWT 발행(언제 로그인했는지 == JWT 발행 시점)

1. 서버 → 클라이언트

로그인 승인

다음 요청부터는 

JWT 들고 다녀!

> 이후 요청
> 
1. 다음 요청(클라이언트 → 서버)

HTTP header에 JWT 담고, 요청 

1. 서버

JWT 시그니처를 내부 로직에서 확인

일치/불일 파악

1. 서버 → 클라이언트

일치하면, 승인

불일치며면 거절

## 5. JWT 실습

[npm: jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

JWT 생성하기

```jsx
var jwt = require('jsonwebtoken'); // 모듈 불러오기 
var token = jwt.sign({ foo: 'bar' }, 'shhhhh'); // 토큰 생성
```

jwt.sign의 첫 매개변수는 `페이로드`

두 번째 매개변수는 `시그니처`

보통 페이로드와 시그니처에 대해서 지정하고, 헤더는 자동으로 설정됨

> 기본 헤더(따로 커스텀하지 않으면 자동 설정됨)
> 

```jsx
{
  "alg": "HS256", // 기본 알고리즘
  "typ": "JWT"    // 기본 타입
}
```

> 결과값
> 

```jsx
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE3MTYzNDg3ODB9.sjGX_6SPBijdMC9-eV29JcTeOMBdLJ8me3-s3_2e14w
```

> 디코딩해보기
> 
1. jwt 사이트에서

![1](./img/6-2-3.png)

verify signature의 secret 입력란에 코드에서 입력했던 비밀 키 입력하면 verify 됨

1. vscode에서

```jsx
var jwt = require('jsonwebtoken'); // 모듈 소환
var token = jwt.sign({foo:'gyul'}, 'gyul') //  토큰 생성 ( == 서명함)

//검증
//검증 성공? -> 페이로드 값 읽을 수 있음
var decoded = jwt.verify(token, 'gyul');
console.log(decoded) //{ foo: 'gyul', iat: 1716349210 }
console.log(decoded.foo) // gyul
```

**jwt.verify(token, secretOrPublicKey, [options, callback])**

jwt.verify 메서드에 첫 번째 매개변수로는 토큰, 두 번째 매개변수로는 지정했던 시크릿 암호키를 입력하면, 페이로드 확인 가능!

결과값: - { foo: 'gyul', iat: 1716349210 }

iat(issuedat의 약자)는 발생시간의 초단위

발행시간에 따라서, 같은 내용이라도 토큰값이 다름

## 6. .env

그런데, jwt 인코딩, 디코딩시에 문제점이 존재함

바로, 시그니처 키값이 그대로 드러난다는 것

깃헙에 올리거나 공유할 때, 키 값은 따로 빼놓고 관리해야 함

이럴때 필요한 게 .env 파일임

### 6.1 .env란?

포트넘버, db 계정, 암호키 등 외부에 유출하면 안되는 주요한 환경 변수를 따로 관리하는 파일

파일확장자는 .env, 프로젝트 폴더 최상위에 존재해야 함

→ 프로젝트의 구조적 일관성을 유지

→  환경 변수의 로딩 경로 문제를 방지

→  환경 분리와 보안 관리가 용이

(+) 최상단에 위치하지 않으면 에러 발생

```jsx
/Users/daeun/node_modules/jsonwebtoken/sign.js:107
    throw err;
    ^

Error: secretOrPrivateKey must have a value
```

> 형식
> 

변수명은 대문자, 스네이크 형식

주석은 #으로

```jsx
//.env 파일

PRIVATE_KEY = 'gyul' #JWT 암호키
```

```jsx
//jwt-demo.js 파일

var jwt = require('jsonwebtoken'); 
var dotenv = require('dotenv');

dotenv.config();

var token = jwt.sign({foo:'gyul'}, process.env.privateKey) 

var decoded = jwt.verify(token, process.env.privateKey);
console.log(decoded)
console.log(decoded.foo) 
```

1. dotenv로 .env 파일 불러옴
2. dotenv.config() 다 활용한다
3. 실제 사용은 process.env.파일에 저장된 값들 중 사용할 키 값

## 7. youtube project에 jwt 적용하기

> .env 파일
> 

```bash
PRIVATE_KEY = 'gyul' #JWT 암호키

PORT = 7777 # 포트넘버

LOGIN_KEY = 'login' #로그인 키값
```

> 로그인
> 

```jsx
// 로그인
router
    .route('/login')
    .post(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 입력 필요'),
            body('password').notEmpty().isString().withMessage('비밀번호 입력 필요'),
            validate
        ]
        ,(req,res, next)=>{
            const {email, password} = req.body
            let sql = "SELECT * FROM users WHERE email = ?"

            conn.query(sql, email, 
                function(err, results){
                    var loginUser = results[0]

                    if (loginUser && loginUser.password== password){
                        const token = jwt.sign({email: loginUser.email, 
                            name: loginUser.name}, process.env.LOGIN_KEY)

                        //res.cookie()

                        res.status(200).json({
                            message: `${loginUser.name}님 로그인되었습니다.`,
                            token_message: token
                        })
                    } else {
                        res.status(404).json({
                            message: "이메일 또는 비밀번호 정보가 틀렸습니다."
                        })
                    }
                }
            )
})
```

1. 로그인 성공 시, JWT 생성하기

```jsx
const token = jwt.sign({email: loginUser.email, 
                            name: loginUser.name}, process.env.LOGIN_KEY)
```

 2. body에 동봉하기(쿠키는 다음 파트에서)

```
res.status(200).json({
    message: `${loginUser.name}님 로그인되었습니다.`,
    token_message: token
})
```

> 결과
> 

![1](./img/6-2-4.png)

로그인 성공, token까지 출력됨