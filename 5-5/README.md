## 1. db 모듈화, users.js에서 사용해보기

### 1.1 mariadb.js 생성, 사용하기

```jsx
// Get the client
const mysql = require('mysql2');

// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Youtube',
  dateStrings : true
});

module.exports = connection;

```

> 모듈화하기
> 

module.exports = connection;)

### 1.2 users.js에서 사용하기

> connection 모듈 불러오기
> 

```sql
const conn = require('../workbench/mariadb')
```

> conn 쿼리문, .get(/users)에서 db 사용하기
> 

```sql
router
    .route('/users')
    .get((req, res) => {
        let { email } = req.body;

        // 파라미터 바인딩을 사용하여 SQL 인젝션 방지
        conn.query(
            `SELECT * FROM user WHERE email = ${email}`,
            function (err, results, fields) {
                // if (err) {
                //     return res.status(500).send({ message: 'Database query error' });
                // }
                if (results.length) {
                    res.status(200).json(results);
                } else {
                    res.status(400).send({
                        message: '회원 정보가 없습니다.'
                    });
                }
            }
        );
    })
```

## 2. socket hang up

코드를 워크벤치에서 돌리면, “socket hang up”이라는 오류 발생함

```bash
[Running] node "/Users/daeun/Desktop/backend-basic/youtuber-project/app.js"
/Users/daeun/Desktop/backend-basic/youtuber-project/routes/users.js:24
                if (results.length) {
                            ^

TypeError: Cannot read properties of undefined (reading 'length')
    at Query.onResult (/Users/daeun/Desktop/backend-basic/youtuber-project/routes/users.js:24:29)
    at Connection._notifyError (/Users/daeun/node_modules/mysql2/lib/connection.js:228:21)
    at Connection._handleFatalError (/Users/daeun/node_modules/mysql2/lib/connection.js:183:10)
    at Connection.handlePacket (/Users/daeun/node_modules/mysql2/lib/connection.js:491:12)
    at PacketParser.onPacket (/Users/daeun/node_modules/mysql2/lib/connection.js:97:12)
    at PacketParser.executeStart (/Users/daeun/node_modules/mysql2/lib/packet_parser.js:75:16)
    at Socket.<anonymous> (/Users/daeun/node_modules/mysql2/lib/connection.js:104:25)
    at Socket.emit (node:events:518:28)
    at addChunk (node:internal/streams/readable:559:12)
    at readableAddChunkPushByteMode (node:internal/streams/readable:510:3)

Node.js v20.12.2

[Done] exited with code=1 in 3.078 seconds
```

results가 Undefined이고, undefined의 Length는 읽을 수 없어서, 오류가 발생한 것

> socket이란?
> 

> hang up
> 

서버가 죽음

> TypeError: Cannot read properties of undefined (reading 'length')
> 

템플릿 문자열

SQL에서 사용하는 정석 문자열 방법

물음표(?) 사용하기

query(sql, ? 변수, 콜백 함수)

```jsx
router
    .route('/users')
    .get((req, res) => {
        let { email } = req.body;

        // 파라미터 바인딩을 사용하여 SQL 인젝션 방지
        conn.query(
            "SELECT * FROM users WHERE email = ?", email,
            function (err, results, fields) {
                // if (err) {
                //     return res.status(500).send({ message: 'Database query error' });
                // }
                console.log(email)
                console.log(results)
                if (results.length) {
                    res.status(200).json(results);
                } else {
                    res.status(400).send({
                        message: '회원 정보가 없습니다.'
                    });
                }
            }
        );
    })
```

> ? 자리표시자로 sql 작성하기
> 

"SELECT * FROM users WHERE email = ?", email, function()

## 3. 회원가입 INSERT

```jsx
// 회원가입
router.post('/join', (req,res)=>{
    if (req.body == {}){
        res.status(400).send({
            message: '다시 입력해주세요'
        })
    } else {
        let { email, name, password, contact } = req.body

        conn.query('INSERT INTO users (email, name, password, contact) VALUES (?,?,?,?)', [email, name, password, contact],
        function(err, results, fields){
            res.status(201).json(results)
        })
}})
```

> 구조분해할당
> 

let { email, name, password, contact } = req.body

> sql, 변수
> 

"INSERT INTO users (email, name, password, contact) VALUES (?,?,?,?))", [email, name, password, contact]

→ 여러 변수를 ? 자리표시자를 이용해서 입력할 때는 배열[] 안에 넣기

## 4. 회원 정보 지우기 DELETE

```bash
  router
    .route('/users')
    .delete((req,res)=>{
        let {email} = req.body;

        conn.query("DELETE FROM users WHERE email = ?", email,
            function(err, results, fields){
                res.json({
                    message: `${email}님, 다음에 또 뵙겠습니다.`
             })
        })
    })
```

## 5. 로그인 POST

### 5.1 버전 1(아이디, 비밀번호 분리해서 알려주기)

```jsx
router.post('/login', (req,res)=>{
    const {email, password} = req.body
    var loginUser = {}

    conn.query("SELECT * FROM users WHERE email = ?", email, 
        function(err, results, fields){
            var loginUser = results[0]
            if (results.length){
                if(loginUser.password == password){
                    res.status(200).json({
                        message: `${loginUser.name}님 로그인되었습니다.`
                    })
                } else {
                    res.status(400).json({
                        message: "비밀번호가 틀렸습니다."
                    })
                }
            } else {
                res.status(404).json({
                    message: "회원정보가 없습니다."
                })
            }
            }
        )
})

```

> loginUser = results[0]
> 

results가 배열 안에 있기에, 첫번째 인덱스를 loginUser에 넣어주기

### 5.2 버전2(아이디, 비밀번호 통합해서 알려주기) - 요즘 트렌드

```jsx
router.post('/login', (req,res)=>{
    const {email, password} = req.body
    var loginUser = {}

    conn.query("SELECT * FROM users WHERE email = ?", email, 
        function(err, results, fields){
            var loginUser = results[0]
            if (loginUser.length && loginUser.password== password){
                    res.status(200).json({
                        message: `${loginUser.name}님 로그인되었습니다.`
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

## 6. users.js 리팩토링

- 안 쓰는 코드 제거 (코드로 설명 안되는 부분에만 주석이 달려야 함)
- 변수명
- 메소드명
- 주석 유무, 주석 내용

### 6.1 리팩토링 전

```jsx
const express = require('express');
const router = express.Router(); // users.js를 ezpress의 router로 사용가능
const conn = require('../workbench/mariadb')

router.use(express.json());

const db = new Map();
let num = 1;

// (추가) app.route 사용해보기
// .get과 .delete가 path가 동일하니까, route로 동일하게 합쳐서 사용 가능
router
    .route('/users')
    .get((req, res) => {
        let { email } = req.body;

        // 파라미터 바인딩을 사용하여 SQL 인젝션 방지
        conn.query(
            "SELECT * FROM users WHERE email = ?", email,
            function (err, results, fields) {
                // if (err) {
                //     return res.status(500).send({ message: 'Database query error' });
                // }
                console.log(email)
                console.log(results)
                if (results.length) {
                    res.status(200).json(results);
                } else {
                    res.status(400).send({
                        message: '회원 정보가 없습니다.'
                    });
                }
            }
        );
    })

    
    .delete((req,res)=>{
        let {email} = req.body;

        conn.query("DELETE FROM users WHERE email = ?", email,
            function(err, results, fields){
                res.json({
                    message: `${email}님, 다음에 또 뵙겠습니다.`
             })
        })
    })

// 회원가입
router.post('/join', (req,res)=>{
    if (req.body == {}){
        res.status(400).send({
            message: '다시 입력해주세요'
        })
    } else {
        let { email, name, password, contact } = req.body

        conn.query('INSERT INTO users (email, name, password, contact) VALUES (?,?,?,?)', [email, name, password, contact],
        function(err, results, fields){
            res.status(201).json(results)
        })
}})

// 로그인
// 아이디, 패스워드 각각 검사하는 코드
router.post('/login', (req,res)=>{
    const {email, password} = req.body
    var loginUser = {}

    conn.query("SELECT * FROM users WHERE email = ?", email, 
        function(err, results, fields){
            var loginUser = results[0]
            if (loginUser.length && loginUser.password== password){
                    res.status(200).json({
                        message: `${loginUser.name}님 로그인되었습니다.`
                    })
            } else {
                res.status(404).json({
                    message: "이메일 또는 비밀번호 정보가 틀렸습니다."
                })
            }
        }
    )
})

module.exports = router
```

### 6.2 리팩토링 후

```jsx
const express = require('express');
const router = express.Router(); 
const conn = require('../workbench/mariadb')

router.use(express.json());

// 회원 개별 조회
// 회원 개별 삭제
router
    .route('/users')
    .get((req, res) => {
        let { email } = req.body;
        let sql = "SELECT * FROM users WHERE email = ?"

        conn.query(
            sql, email,
            function (err, results) {
                    res.status(200).json(results)
            }
        )
    })

    
    .delete((req,res)=>{
        let {email} = req.body
        let sql = "DELETE FROM users WHERE email = ?"

        conn.query(sql, email,
            function(err, results){
                res.json(results)
        })
    })

// 회원가입
router.post('/join', (req,res)=>{
    if (req.body == {}){
        res.status(400).send({
            message: '다시 입력해주세요'
        })
    } else {
        let { email, name, password, contact } = req.body
        let sql = 'INSERT INTO users (email, name, password, contact) VALUES (?,?,?,?)'
        let values = [email, name, password, contact]
        
        conn.query(sql, values,
        function(err, results, fields){
            res.status(201).json(results)
        })
}})

// 로그인
router.post('/login', (req,res)=>{
    const {email, password} = req.body
    let sql = "SELECT * FROM users WHERE email = ?"

    conn.query(sql, email, 
        function(err, results){
            var loginUser = results[0]

            if (loginUser && loginUser.password== password){
                    res.status(200).json({
                        message: `${loginUser.name}님 로그인되었습니다.`
                    })
            } else {
                res.status(404).json({
                    message: "이메일 또는 비밀번호 정보가 틀렸습니다."
                })
            }
        }
    )
})

module.exports = router
```

> 수정 사항
> 
1. db 제거
2. query의 콜백함수의 fields 매개변수 사용하지 않으니 제거(err는 순서 때문에 사용하지 않더라도 유지해야 함)
3. 필요없는 주석 제거
4. query 인수로 들어갈 값을 sql, values로 따로 빼서 변수로 담기

## 7. channels.js mariadb 사용, 리팩토링

### 7.1 수정 전 코드

```jsx
const express = require('express');
const router = express.Router();

router.use(express.json());

const db = new Map();
let id = 1;
 
router
    .route('/')
    // 채널 생성
    .post((req,res)=>{
        let {channelTitle} = req.body
    
        if (channelTitle){
            db.set(id++, req.body)
            res.status(201).send({
                message: `${db.get(id-1).channelTitle} 채널을 응원합니다`
            })
            console.log(db)
        } else {
            res.status(400).send({
                message : `요청 값을 다시 확인해주세요.`
            })
        }
    })

    // 채널 전체 조회
    // third - if 고도화 후
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

    // second - userId와 channel 연관성 고려 후, if 중첩 고도화 전
//     .get((req,res)=>{
//         if(db.size){
//             var {userId} = req.body
//             var channels = []

//             if(userId == undefined){
//                 res.status(404).json({
//                      message: "로그인이 필요한 페이지입니다."
//                 })
//             } else {
//                 db.forEach((x,y)=>{
//                     if (x.userId == userId){
//                         channels.push(x)
//                     }
//                 })
//                 if(channels.length == 0){
//                     res.status(404).json({
//                         message: '조회할 채널이 없습니다.'
//                     })
//                 } else {
//                     res.status(200).json(channels)
//                 }
//             }
//         }}
// )

    // first - userId와 channel 연관성 고려 전
            // var channels = []

            // if(db.size){
            //     var channels = []
            //     db.forEach((ch, key)=>{
            //         channels.push(ch)
            //     })

            //     res.status(200).json(channels)
            // } else {
            //     res.status(404).json({
            //         message: '조회할 채널이 없습니다.'
            //     })
            // }

    // })

router 
    .route('/:id')
    //채널 수정
    .put((req,res)=>{
        let {id} = req.params
        id = parseInt(id)

        var channel = db.get(id)
        var oldTitle = channel.channelTitle
    
        let newTitle = req.body.channelTitle
    
        if(channel == undefined){
            res.status(400).send({
                message: `${id}가 존재하지 않습니다.`
            })
        } else {
            channel.channelTitle = newTitle
            db.set(id, channel)
            res.status(200).send({
                message: `${oldTitle}에서 ${newTitle}로 변경되었습니다`
            })
        }
    })
    // 채널 삭제
    .delete((req,res)=>{
        let {id} = req.params
        id = parseInt(id)

        var channel = db.get(id)

        if(channel){
            db.delete(id)

            res.status(200).send({
                message:`${channel.channelTitle}가 삭제되었습니다.`
            })
        } else {
            res.status(400).send({
                message: `입력된 id ${id}가 데이터베이스에 없습니다.`
            })
        }
    })

    // 채널 개별 조회
    .get((req,res)=>{
        let {id} = req.params
        id = parseInt(id)

        var ch = db.get(id)

        if(ch){
            res.status(200).json(ch)
        } else {
            res.status(404).send({
                message: "다시 확인해주세요"
            })
        }
    })

module.exports = router;

```

### 7.2 채널 개별 조회

```jsx
router 
    .route('/:id')
    .get((req,res)=>{
        let {id} = req.params
        id = parseInt(id)
        let sql = 'SELECT * FROM channels WHERE id =?'

        conn.query(sql, id, 
            function(err, results){
                if(results.length){
                    res.status(200).json(results)
                } else {
                    notFoundChannel(res)
                }
        })
    })
```

### 7.2 채널 전체 조회

```jsx
router
    .route('/')
    .get((req,res)=>{
        var {userId} = req.body
        let sql = 'SELECT * FROM channels WHERE user_id = ?'

        if(userId){
            conn.query(sql, userId, function(err, results){
                if(results.length){
                    return res.status(200).json(results)
                } else {
                    return notFoundChannel(res)
                }
            }) 
        } else {
                return res.status(404).end();
            }
})
```

> 단축평가
> 

userId && conn.query()

userId가 존재할 때, 쿼리 이하 부분 확인

> res.end()
> 

userId가 존재하지 않으면, 그냥 400 날리고 끝내기

### 8. 채널 생성

```jsx
router
    .route('/')
    // 채널 생성
    .post((req,res)=>{
        let {name, user_id} = req.body
        if(name, user_id){
            let {name, user_id} = req.body

            let sql = 'INSERT INTO channels (name, user_id) VALUES (?, ?)'
            let values = [name, user_id]
    
            conn.query(sql, values,
                function(err, results){
                    res.status(201).json(results)
                }
            )
        } else {
            res.status(400).json({
                message: "요청 값을 제대로 보내주세요."
            })
        }
    })
```

<aside>
⭐ 의도

</aside>

name. user_id 가 req.body에 모두 담겨와야 하며, 각 타입도 문자열과 숫자여야 한다.

그런데 위의 코드의 경우에는 타입에 대한 확인이 되지 않아, user_id에 문자열이 담겨져도 201가 뜨게 되다. (db에는 insert 자동으로 걸러져서 업로드 되지 않지만, 위의 코드로는 오류가 발생하지 않는게 문제)

→ `유효성 검사가 필요하다!`