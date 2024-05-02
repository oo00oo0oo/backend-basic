## 1. POST

HTTP에 담아보내는 나의 목적 = Method

http는 규약, 따라서 정해진 용어가 존재

- 생성(등록): POST
    - ex) 회원가입(id, password, name email, contact 등등) → body 공간에 숨겨서 전달해야 함
    - POST는 데이터가 바디에 숨겨져있어야 알 수 있을 것
- 조회: GET
- 수정: PUT/PATCH
- 삭제: DELETE

POST 

```jsx
app.post('/test', (req,res)=>{
  res.send('Hello Post!!!')
})
```

POST의 경우, node.js로 브라우저에서 띄우려고 하니, 불가능

body 공간에 숨겨서 전달해야 하는 거라서 그런가?

그래서, postman을 깔고 실행하니, 실행됨

![img](./img/Screenshot%202024-05-02%20at%201.03.48 AM.png)

하지만, 하단의 이 코드는 내가 정적으로 작성한 코드를 post해주는 것 뿐이니까, body에 직접 내용을 담아서 보내보자

```jsx
app.post('/test', (req,res)=>{
  res.send('Hello Post!!!')
})
```

```jsx
app.use(express.json());

app.post('/test', (req,res)=>{
  // body에 숨겨져서 들어온 데이터를 화면에 뿌려줘보자
  console.log(req.body)
  res.json(req.body.message)
})

```

app.use(express.json())은 

express.json()는 express 미들웨어 중 하나, body를 JSON 형식으로 파싱해주는 역할을 함

이 미들웨어는 들어오는 요청의 Content-Type 헤더를 확인하고, 그 값이 application/json인 경우에만 요청 본문 파싱해서 req.body 객체에 저장함

결국, express.json 미들웨어로 요청 본문 파싱* → req.body 사용해서 데이터 접근 가능 → res.json으로 데이터 화면에 뿌리기

*문자열을 토큰으로 분해하고 해석, Express 어플리케이션에서 요청 본문 파싱한다는 건 HTTP 요청의 본문을 분해해서 JS 객체로 변환하는 과정 의미

app.use(express.json()) 코드 없이, 아래 코드 돌리고, body 값을 객체로 주면 오류가 발생

```jsx
app.post('/test', (req,res)=>{
  // body에 숨겨져서 들어온 데이터를 화면에 뿌려줘보자
  console.log(req.body)
  res.json(req.body.message)
})
```

![img](./img/Screenshot%202024-05-02%20at%202.11.55 AM.png)

```jsx
{
    "message":"Bye POST!"
}
```

## 2. 유튜브 실습 고도화

### 2.1 새로운 유튜버 db에 추가하기

```jsx
const express = require('express');
const app = express();

app.listen(3000);

// data setting
const youtuber1 = {
    channelTitle : 'MBCnews',
    sub : '434만명',
    videoNum : '24만개'

}

const youtuber2 = {
    channelTitle : 'essential',
    sub : '137만명',
    videoNum : '391개'

}

const youtuber3 = {
    channelTitle : '뉴진스',
    sub : '600만명',
    videoNum : '500개'

}

const db = new Map();

db.set(1, youtuber1)
db.set(2, youtuber2)
db.set(3, youtuber3)

console.log(db)

//REST API 설계
app.get('/youtuber/:id', function(req, res){
    let {id} = req.params

    id = parseInt(id)
    const youtuber = db.get(id)

    if (db.get(id) == undefined){
        res.json({
            message: '유튜버 정보를 찾을 수 없습니다'
        })
    } else {
        res.json(youtuber)}
})
```

아쉬운 점

1. 기존 유튜버 3명만 정보 반환 가능, 새로운 유튜버 등록 불가
2. 1,2,3 유튜버에 대한 api

→ POST로 유튜버 추가

db key값을 변수로 변경하기

기본 세팅은 1이고, 유튜버가 추가될수록 key값도 1이 추가되도록

```jsx
const db = new Map();
let id = 1;
db.set(id++, youtuber1) //기존 첫 인자는 1
db.set(id++, youtuber2) //기존 첫 인자는 2
db.set(id++, youtuber3) //기존 첫 인자는 3

```

id변수를 key로,  req.body를 value로 하는 db 객체 한 쌍

```jsx

app.post('/youtubers', (req,res)=>{
    // API URL은 복수로 하는게 통일감 부여 가능
    db.set(id++, req.body)
    console.log(db)

    res.json({
        message: `${db.get(id-1).channelTitle}님, 유튜버 생활을 응원합니다!`
    })
})
```

message에서 db에 저장된 값 전달할때는 이미 id값이 한 개 증가한 상태라서 id-1로 value값 찾기

### 2.2 유튜버 전체 조회하기

```jsx
app.get("/youtubers", function(req,res){
    res.json({
        message: 'test'
    })
})
```

만약, Url을 복붙할 경우, 값이 깨지거나 눈에 안 보이는 추가적인 값이 섞여 들어가서 오류(**[Invalid character in header content ["Host"] Postman](https://stackoverflow.com/questions/68138729/invalid-character-in-header-content-host-postman))** 발생 가능함

[Invalid character in header content ["Host"] Postman](https://stackoverflow.com/questions/68138729/invalid-character-in-header-content-host-postman)

해결법은 직접 url 타이핑하기