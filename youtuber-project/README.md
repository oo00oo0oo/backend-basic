## 1. Node.js에서 router 라우팅이란?

request가 들어오면, 원하는 경로에 따라 적절한 방향으로 경로를 안내해주는 것

URL, method → 호출 “콜백 함수”

### 1.1 현재 코드 고도화하기(개선할 부분)

1. user.js
2. channel.js

이 두 가지 파일에서 같은 localhost:7777이라는 동일한 경로를 사용하는데, 파일을 분리해놓으니, `두 가지 파일의 코드를 동시에 돌릴 수 없음`

<aside>
⚠️ name refactoring in VS code(CLI)

</aside>

<aside>
⚠️ naming convention of node file

</aside>

node스러우러면, 복수형 이름.js

ex) users.js, channels.js

### 1.2 코드 고도화(app.use 상위폴더로 users.js, channels.js 합치기)

```jsx
const express = require('express');
const app = express();

app.listen(7777);

const userRouter = require('./routes/users')
const channelRouter = require('./routes/channels')

app.use("/", userRouter)
app.use("/channels", channelRouter)
```

1. user.js, channel.js 파일을 각각 모듈화(module.exports = )
2. app.js라는 상위파일에서 모듈을 불러와서 사용(require, app.use)
3. app.js에서 코드를 실행하면, user.js, channel.js 자동 재생

<aside>
⚠️ app.use의 첫 파라미터는 path

</aside>

path는 “/”부터 시작하고, 만약 module 내의 route url이 겹치는 부분이 있다면, 겹치는 부분까지 작성 후, 원본 파일에서는 각 route를 겹치는 부분은 제거하고 이하의 부분만 남겨두기

ex) 

```
//channel
router 
    .route('/:id')
```

url은 미들웨어 또는 라우터를 적용할 경로를 뜻함

app.use("/", userRouter)에서는 / 경로로 들어오는 모든 요청에 대해 userRouter를 사용하도록 설정함

즉, userRouter의 미들웨어가 / 경로의 모든 요청에 대해 실행됨

## 2. ERD 그리기



어느정도 코드가 고도화되었으니, users, channels의 ERD와 이들의 관계를 확인해보자.

### 2.1 기존 API 설계
![drawSQL-image-export-2024-05-12](https://github.com/oo00oo0oo/backend-basic/assets/150869327/b3215263-4b2b-464c-a4dd-5574b1642532)


- `채널 생성 POST channels`
    - req: body (channelTitle)
    - res: res.status(201).send({${channelTitle}님 채널을 응원합니다.}) → 채널 관리 페이지로 이동
- `채널 수정 PUT channels/:id`
    - req: URL(id), body(channelTitle)
    - res: res.status(200).send({“채널명이 기존 ${}에서 ${}로 수정되었습니다”})
- `채널 삭제 DELETE channel/:id`
    - req: URL(id)
    - res: res.status(200).send({“채널이 삭제되었습니다”}) → 메인 페이지로 이동
- `채널 전체 조회 GET/channels`
    - req: URL
    - res : res.status(200).채널 전체 데이터
- `채널 개별 조회 GET/channels/:id`
    - req: URL
    - res: res.status(200). 채널 개별 데이터
    

ERD로 구현한 부분과, API 설계에서 차이나는 부분이 존재한다.

우리는 유저 아이디 1개당 여러 개의 채널 생성이 가능하도록 코드를 작성하고 싶었다.

하지만, API 설계부분을 보면, 실질적으로 채널 생성시 어떤 유저의 채널이 생성된것인지 명시되지 않았고,

따라서, 채널을 조회 시에도 유저-채널 관계를 고려하지 않고, 존재하는 모든 채널을 출력해주었다.

ERD를 그림으로써,

1. 채널 등록 시, 유저 아이디도 함께 DB에 저장
2. 채널 조회 시, 유저 단위로 조회하기

이 두 가지 부분을 수정해야 한다는 것을 알게 되었다. 

## 3. 채널 API 수정

### 3.1 수정된 API 설계

- `채널 생성 POST channels`
    - req: body (channelTitle, **userId**) ~~*cf) userId는 body에 받는게 아니라, 사실은 JWT를 이용해서 header에서 받아야 하지만,,, 지금은 기초 과정이라 심화에서 활용할 예정*~~
    - res: res.status(201).send({${channelTitle}님 채널을 응원합니다.}) → 채널 관리 페이지로 이동
- `채널 수정 PUT channels/:id`
    - req: URL(id), body(channelTitle)
    - res: res.status(200).send({“채널명이 기존 ${}에서 ${}로 수정되었습니다”})
- `채널 삭제 DELETE channel/:id`
    - req: URL(id)
    - res: res.status(200).send({“채널이 삭제되었습니다”}) → 메인 페이지로 이동
- `채널 전체 조회 GET/channels`
    - **req: body(userId)**
    - res : res.status(200).채널 전체 데이터
- `채널 개별 조회 GET/channels/:id`
    - req: URL
    - res: res.status(200). 채널 개별 데이터

### 3.2 API → 코드 반영

> 채널 등록 시, 유저 아이디도 함께 DB에 저장
> 

이 경우는, 실질적으로 req에서 body에 받아오는 값이 달라지는 것임으로, 수정할 것이 없음.

> 채널 조회 시, 유저 단위로 조회하기
> 

<aside>
⚠️ first try

</aside>

```jsx
    .get((req,res)=>{
    // db
        if(db.size){
            var {userId} = req.body
            var channels = []
	  //userId가 body에 없는 경우
            if(userId == undefined){
                res.status(404).json({
                     message: "로그인이 필요한 페이지입니다."
                })
            } else {
                db.forEach((x,y)=>{
                    if (x.userId == userId){
                        channels.push(x)
                    }
                })
                //userId가 가진 채널이 없는 경우
                if(channels.length == 0){
                    res.status(404).json({
                        message: '조회할 채널이 없습니다.'
                    })
                } else {
                    res.status(200).json(channels)
                }
            }
        }}
)
```

- 고려해야 할 것 2가지
    1. userId가 body에 없는 경우
        
        이 경우는, 로그인 후 일정 시간이 지나서 채널 조회를 하려고 한 경우 혹은 로그인 하지 않고 잘못된 url로 들어와서 채널 조회를 하려는 경우로 볼 수 있을 것
        
        → userId가 없다고 안내하면서, 로그인 하라고 안내해야 함
        
    2. userId가 가진 채널이 없는 경우

<aside>
⚠️ second try → if 중첩 없애고 고도화

</aside>

```jsx
    .get((req,res)=>{
        if(db.size){
            var {userId} = req.body
            var channels = []

            if(userId == undefined){
                res.status(404).json({
                     message: "로그인이 필요한 페이지입니다."
                })
            } else {
                db.forEach((x,y)=>{
                    if (x.userId == userId){
                        channels.push(x)
                    }
                })
                if(channels.length == 0){
                    res.status(404).json({
                        message: '조회할 채널이 없습니다.'
                    })
                } else {
                    res.status(200).json(channels)
                }
            }
        }}
)
```

<aside>
⚠️ third try → 함수 사용

</aside>

```jsx
    .get((req,res)=>{
        var {userId} = req.body
        var channels = []
        if(db.size && userId){
            db.forEach((x,y)=>{
                if (x.userId == userId){
                    channels.push(x)
                }
            })
            if(channels.length){
                res.status(200).json(channels)
            } else {
                notFoundChannel()
        }} else {
            notFoundChannel()
        }
})

function notFoundChannel(){
    res.status(404).json({
        message: "채널 정보를 찾을 수 없습니다."
    })
}
```

### 3.3 if 중첩 줄이기

항상 코드 작성시 고려해야 함

비구조화를 통해서 쉽게 할 수 있음

## 4. 회원 API 수정

- 회원 가입 (POST/join)
    - req: body(userId,pw,name)
    - res:  “${name}님 회원가입을 환영합니다” // 로그인 페이지로 이동

---

- 로그인 (POST/login) - post인 이유? get은 body가 없음
    - req: body(userId, pw)
    - res: “${name}님 환영합니다” // 메인페이지로 이동

---

- 회원정보 조회 (개별) (GET/users~~/:id~~)
    - req: URL(userId)
    - res: id, name
- 회원 탈퇴 (개별) (DELETE/users~~/:id~~)
    - req: URL(userId)
    - res: “${name}님 다음에 또 뵙겠습니다“ // 메인페이지로 이동
