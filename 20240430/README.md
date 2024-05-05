# 1. foreach

```jsx
const arr = [1,2,3,4,5]

// 객체에서 요소 하나 꺼낸 다음에 돌리는 콜백함수
// 매개변수로 그 요소를 전달하여 호출되는 콜백함수

arr.forEach(function(a,b,c) {
    console.log(`a: ${a}, b: ${b}, c: ${c}`)
})
```

a는 값, b는 인덱스값, c는 객체 전체

> 결과
> 

```
a: 1, b: 0, c : 1,2,3,4,5
a: 2, b: 1, c : 1,2,3,4,5
a: 3, b: 2, c : 1,2,3,4,5
a: 4, b: 3, c : 1,2,3,4,5
a: 5, b: 4, c : 1,2,3,4,5
```

# 2. Map (vs forEach)

```jsx
const arr = [1,2,3,4,5]

const foreachArr = arr.forEach(function(a,b,c) {
    return a * 2
})

console.log(arr)

const mapArr = arr.map(function(a,b,c) {
    return a * 2
})

console.log(arr)

console.log(foreachArr)
console.log(mapArr)
```

map은 return 값으로 실행결과 모은 새 배열을 제공

forEach는 return 값으로 배열 미제공, 각 요소에 대한 callback만 실행

> 결과
> 

```jsx
[ 1, 2, 3, 4, 5 ]
[ 1, 2, 3, 4, 5 ]
undefined
[ 2, 4, 6, 8, 10 ]
```

# 3. 유튜버 데모 업그레이드 (delete)

URL이 동일해도, 메소드가 다르면 사용 가능

### API 설계

### 1. 전체 유튜버 조회

> (GET), /youtubers
> 
1. req : X
2. res : map 전체 조회

### 2. 개별 유튜버 조회

> (GET), /youtubers/:id
> 
1. req: [params.id](http://params.id) (map에 저장된 key값 전달)
2. res: map에서 id로 객체를 조회해서 전달

### 3. 유튜버 등록

> (POST), /youtubers
> 
1. req: body (channelTitle, sub = 0, videoNum = 0), db에 저장까지
2. res: channelTitle님 유튜버 생활을 응원합니다

### 4. 개별 유튜버 삭제

> (DELETE), /youtubers/:id
> 
1. req: params.id
2. res: channelTitle님, 아쉽지만 다음에 또 뵙겠습니다.

```jsx
// 개별 유튜버 삭제하기, delete(직접 작업)
app.delete('/youtubers/:id', (req,res)=>{
    let {id} = req.params
    id = parseInt(id)
    const delId = db.get(id)
    const channeltitle1 = delId.channelTitle
    console.log(channeltitle1)
    db.delete(id)

    res.json({
        message: `${channeltitle1}님, 바이바이`
    })

})
```

```jsx
// 개별 유튜버 삭제하기 delete
app.delete('/youtubers/:id', (req,res)=>{
    let {id} = req.params
    id = parseInt(id)

    var youtuber = db.get(id) // 중복 방지, 변수 사용
    //예외처리
    if (youtuber == undefined){
        res.json({
            message: `요청하신 ${id}는 없는 유튜버입니다.`
        })
    } else {
        const channelTitle = youtuber.channelTitle
        db.delete(id)

        res.json({ 
            message: `${channelTitle}님, 아쉽지만 우리 인연은 여기가지 인가요?`
        })
    }  
})

```

### 5. 전체 유튜버 삭제

> (DELETE), /youtubers
> 

req: X

res: ‘전체 유튜버가 삭제되었습니다’

> 전체 유튜버 삭제하기(먼저 작업)
> 

```jsx
app.delete('/youtubers', (req,res)=>{
    db.forEach((x)=> db.delete(x))
    console.log(db.keys.length)
    if (db.keys.length == 0){
        res.json({
            message: "?"
        })
    } else {
        res.json({
            message: '전체 유튜버가 삭제되었습니다.'
        })
    }
})

```

> 전체 유튜버 삭제하기(완성)
> 

```jsx

app.delete('/youtubers', (req,res)=>{
    
    let msg = ""

    if (db.size >= 1){
        db.clear();
        msg = "전체 유튜버가 삭제되었습니다."
    } else {
        msg = '삭제할 유튜버가 없습니다.'
    }

    res.json({
        message: msg
    })
})
```

<aside>
⚠️ 차이점

</aside>

forEach문으로 하나씩 삭제한 것 → clear 메서드 사용하기

db.keys.length로 key 개수 확인 → size 메서드로 개수 확인

res.json에 넣을 message를 변수로 만들어서, 조건에 맞는 값 할당하고 res.json에 따로 넣기

### 6. 개별 유튜버 수정하기

> PUT, /youtubers/:id
> 

req: params.id, body <= channelTitle

res: ‘(이전)channelTitle님, 채널명이 (새로운)channelTitle로 변경되었습니다”

> 개별 유튜버 수정하기(먼저 작업)
> 

```jsx

app.put('/youtubers/:id', (req,res)=>{
    let {id} = req.params
    id = parseInt(id)

    const ori_id = db.get(id).channelTitle
    let title = db.get(id).channelTitle

    title = req.body.channelTitle
    res.json({
        messsage: `${ori_id}님, 채널명이 ${title}로 변경되었습니다.`
    })
})
```

> 개별 유튜버 수정하기
> 

```jsx
app.put('/youtubers/:id', (req,res)=>{
    let {id} = req.params
    id = parseInt(id)

    var youtuber = db.get(id)
    var oldTitle = youtuber.channelTitle
    if (youtuber == undefined){
        res.json({
            message: `요청하신 ${id}번은 없는 유튜버입니다.`
        })
    } else {
        var newTitle = req.body.channelTitle
        youtuber.channelTitle = newTitle
        db.set(id, youtuber)

        res.json({
            messsage: `${oldTitle}님, 채널명이 ${newTitle}로 변경되었습니다.`
        })
    }
})
```

# 4. 리펙토링

소프트웨어의 코드 내부(구조)를 변경하는 것

> 목적
> 
1. 이해하기 쉽게하기
2. 성능
3. 안전성

> 리팩토링은 언제 해야 하는가?
> 
1. 에러(문제점)이 n회 발견되었을 때, 리팩토링 해야 한다
2. 리팩토링을 하면서, 에러를 발견할 수 있다.
3. 기능을 추가하기 전
    
    ex) API URL 설계 수정
    
4. 코드 리뷰

<aside>
⚠️ 절대 하면 안되는 시점

</aside>

배포, 운영 직전에는 절대 코드 수정해서는 안됨

# 5. http code

HTTP는 인터넷 상에서 통신할 때 사용하는 규약이고 안에 작성되어서 들어가는 ‘상태’

[HTTP 상태 코드 - HTTP | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Status)

조회/수정/삭제 성공시: 200

등록 성공 : 201

찾는 페이지 없음(url에 맞는 api 없음) : 400

서버가 죽었을 때(서버가 치명적 오류 맞았을 때) : 500