# 1. 핸들러

핸들러는 요청에 의해서 실행되는 메소드

HTTP request가 날아오면, 자동으로 호출되는 메소드

노드에서는 콜백함수로, `app.HTTPMETHOD(path, handler)`

cf. 스프링에서는 컨트롤러

# 2. 예외처리

### find()

json array는 인덱스가 0부터 시작

해결법 1 : -1하기

배열에서 찾을 때 -1하기

```jsx
// 과일 개별 조회 방법 1 (id-1)
app.get('/fruits/:id', (req,res)=>{
    let {id} = req.params
    id = parseInt(id)
    console.log(id)
    res.json(fruits[id-1])
})
```

해결법 2 - forEach

```jsx
//과일 개별 조회 방법 2 (forEach)
app.get('/fruits/:id', function(req,res){
    let id = req.params.id
    var findFruit = ""
    fruits.forEach(function(fruit){
        if(fruit.id == id){
            findFruit = fruit
        }
    })
    res.json(findFruit)
})
```

해결법 3 - find

```jsx
//과일 개별 조회 방법 3 (find)
app.get('/fruits/:id', function(req,res){
    let {id} = req.params
    var fruit = fruits.find(f => f.id == id)

    if(fruit){
        res.json(fruit)
    } else {
        //404는 찾는 리소서 없을 떄 던지는 HTTP 상태 코드
        res.status(404).json({
            message : "전달주신 id로 저장된 과일 없습니다."
        })
    }
})
```

### HTTP 상태 코드

HTTP 상태 코드는 HTTP 안에 작성되어서 들어가는 상태로 클라이언트와 소통을 정확히 하기 위해 존재한다. 

- `2**` - 2로 시작하면 성공
    - `200` - 조회, 수정, 삭제 성공 (GET, PUT, DELETE)
    - `201` - 등록 성공 (POST)
- `4**` - 4로 시작하는 코드는 클라이언트 잘못
    - `400` - 요청된 연산을 할 때, 필요한 데이터가 덜 왔을 때
    - `404` - 찾는 리소스가 없을 때, (url에 맞는 api 없음)
- `5**` - 5로 시작하는 코드는 서버가 죽었을 대, 즉 서버가 잘못했을 때

### == vs ===

==은 자료형 상관 없이, 값만 비교

===은 자료형과, 값 모두 동일한지 판단

### 예외처리 심화 - map과 undefined

> (GET) 전체 유튜버 조회
> 

```jsx
app.get("/youtubers", function(req,res){
    var youtubers = {}
    if (youtubers) {
        db.forEach(function(value,key){
            youtubers[key] = value
        });

        res.json(youtubers)

    } else {
        res.status(404).send({
            message: '조회할 유튜버가 없습니다.'
        })
    }

})
```

전체 삭제 후, 위의 코드 돌리면, 404가 뜰 것을 기대했는데, 

빈 괄호{}는 자체가 없는 게 아니라, 존재하지만 안에 요소가 없기에, undefined라고 볼 수 없다

map 객체는 안에 아무런 요소가 없어도, undefined값을 가지지 않는다는 것!

> (GET) 전체 유튜버 조회 - 고도화, 예외처리, http 코드 상태 처리 후
> 

```jsx
app.get("/youtubers", function(req,res){
    var youtubers = {}
    if (db.size !== 0 ) {
        db.forEach(function(value,key){
            youtubers[key] = value
        });

        res.json(youtubers)

    } else {
        res.status(404).send({
            message: '조회할 유튜버가 없습니다.'
        })
    }

})
```

db의 사이즈가 0인지 아닌지로 판단해서 값 전달하는 방향으로 변경

> (GET) 개별 유튜버 조회 - 고도화, 예외처리, http 코드 상태 처리 후
> 

```
app.get('/youtubers/:id', function(req, res){
    // API URL은 복수로 하는게 통일감 부여 가능
    let {id} = req.params
    id = parseInt(id)
    const youtuber = db.get(id)

    if(youtuber){
        res.json(youtuber)
    } else {
        res.status(404).send({
            message: '유튜버 정보를 찾을 수 없습니다'
        })
    }
})
```

개별 유튜버 조회도, 예외 처리 및 res.status로 http 상태 코드 변경 추가

> (POST) 개별 유튜버 추가 - 고도화, 예외처리, http 코드 상태 처리 후
> 

```jsx
app.post('/youtubers', (req,res)=>{
    console.log(req.body.channelTitle)
    const channelTitle = req.body.channelTitle
    if (channelTitle){
        db.set(id++, req.body)
        res.status(201).send({
            message: `${db.get(id-1).channelTitle}님, 유튜버 생활을 응원합니다!`
        })
    } else {
        res.status(400).send({
            message: "channelTitle이 없습니다."
        })
    }
})
```

- POST 성공 시, `201`
    
    [201 Created - HTTP | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Status/201)
    
- 서버가 요청의 구문을 인식하지 못한 경우, `400`
    
    [400 Bad Request - HTTP | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Status/400)
    

# 2. 미니 프로젝트 해보기

## 2.1 API 설계

<aside>
⚠️ API 설계 시, 그림으로 그리면 만들기 훨씬 수월하다.

</aside>

### 2.1.1 회원

회원은 계정 1개당 채널 100개 생성 가능

- 회원 가입
    - 회원가입 페이지 화면 완성 시에는 API 필요 없음
    - 회원가입 버튼을 클릭 시, id, pw, 이름을 가지고 회원가입 시켜줄 `API 필요함`

---

- 로그인
    - 로그인 페이지 화면 완성 시에는 API 필요 없음
    - 로그인 버튼을 클릭 시, id, pw 로그인 시켜줄 `API 필요함`

---

- 회원 탈퇴
    - 마이페이지 페이지 화면 생성 시에는, `회원 정보 조회할 API 필요함`
    - 회원탈퇴 버튼 클릭 시, 회원 탈퇴 시켜줄 `API 필요함`

### 2.1.2 회원 API 설계

- 회원 가입 (POST/join)
    - req: body(id,pw,name)
    - res:  “${name}님 회원가입을 환영합니다” // 로그인 페이지로 이동

---

- 로그인 (POST/login) - post인 이유? get은 body가 없음
    - req: body(id, pw)
    - res: “${name}님 환영합니다” // 메인페이지로 이동

---

- 회원정보 조회 (개별) (GET/users/:id)
    - req: URL(id)
    - res: id, name
- 회원 탈퇴 (개별) (DELETE/users/:id)
    - req: URL(id)
    - res: “${name}님 다음에 또 뵙겠습니다“ // 메인페이지로 이동

### .route 사용하기
```jsx
app
    .route('/users/:id')
    .get((req,res)=>{
        let {id} = req.params
        id = parseInt(id)
    
        const user = db.get(id)
        if (user){
            res.status(200).send({
                id: user.id,
                name: user.name
            })
        } else {
            res.status(400).send({
                message: '없는 아이디 정보입니다.'
            })
        }
    })
    .delete((req,res)=>{
        let {id} = req.params
        id = parseInt(id)
    
        const user = db.get(id)
        if (user){
            let name = user.name
            db.delete(id)
            res.json({
                message: `${name}님, 다음에 또 뵙겠습니다.`
            })
        } else {
            res.status(404).send({
                message: `없는 정보입니다.`
            })
        }
    })
```