## 1. 유효성 검사

### 1.1 express-validator

사용자가 입력한 값의 유효성(타당성)을 확인하는 것

예를 들어서, 우리 채널 post의 user_id, name의 경우

전자는 값이 있고 숫자여야 하고, 후자는 숫자가 아닌 문자열이며 2자리 이상이여야 함

이를 위해서는 `express-validator`가 필요함

> express-validator 설치
> 

[Getting Started | express-validator](https://express-validator.github.io/docs/guides/getting-started)

```jsx
npm install express-validator
```

### 1.2 express-validator 사용

```jsx
const express = require('express');
const router = express.Router();
const conn = require('./mariadb')
const {body, validationResult} = require('express-validator')

router.use(express.json());

router
    .route('/')
    // 채널 생성
    .post(
        [body('userId').notEmpty().isInt().withMessage('숫자입력필요'), 
        body('channelName').notEmpty().isString().withMessage('문자입력필요')]
        , (req,res)=>{
            const err = validationResult(req)

            if(!err.isEmpty()){
                return res.status(400).json(err.array())
            }

            const {channelName, userId} = req.body
            let sql = 'INSERT INTO channels (name, user_id) VALUES (?, ?)'
            let values = [channelName, userId]

            conn.query(sql, values,
                function(err, results){
                    res.status(201).json(results)
                }
            )

    })
```

> const {body, validationResult} = require('express-validator')
> 

express-validator 모듈로부터 body와 validationResult 변수 가져오기

> [body('userId').notEmpty().isInt().withMessage('숫자입력필요'), 
 body('channelName').notEmpty().isString().withMessage('문자입력필요')]
> 

req.body의 userId는 값이 있고, 숫자여야 하고,

req.body의 channelName은 값이 있고, 문자열이여야 함

위의 코드는 userId와 channelName의 필드를 검사하는 것

만약 유효성 검사가 실패한다면, withMessage의 메시지가 반환됨

> const err = validationResult(req)
> 

요청의 유효성 검사 결과를 err 변수에 할당한 것

유효성 검사가 성공하면 err.isEmpty()는 true를, 실패하면 false를 반환함

> if(!err.isEmpty()){
    return res.status(400).json(err.array())
}
> 

err 변수(유효성 검사 결과)가 실패하면, 404 반환

return을 사용하여 코드가 종료되도록 설정

> const {channelName, userId} = req.body
let sql = 'INSERT INTO channels (name, user_id) VALUES (?, ?)'
let values = [channelName, userId]

conn.query(sql, values,
        function(err, results){
           res.status(201).json(results)
        }
)
> 

유효성 검사 통과한 경우 실행될 코드들

### 1.3 sql err 처리

```
conn.query(sql, values,
    function(err, results){
        if(err){
            return res.status(400).end();
        }
        res.status(201).json(results)
    }
)
```

SQL에서 에러가 발생하는 경우에 예외 처리하기

예를 들어서, userId는 FK인데, 입력값이 FK 중에 없는 경우

> SQL 에러와, 유효성 검사 에러 차이
> 

유효성 검사 에러의 경우는 빈 값인지, 입력값의 타입이 무엇인지 확인 후, 설정값과 다르면 에러를 발생하는 것이고

SQL 에러의 경우는, 유효성 검사를 통과해도, 실질적으로 db 상에서 없는 값일 경우에 에리가 발생되는 것임

## 2. 채널 개별 조회

```jsx
const {body, param, validationResult} = require('express-validator')

.get(param('id').notEmpty().withMessage('아이디 입력 필요')
,(req,res)=>{
    const err = validationResult(req)

    if(!err.isEmpty()){
        res.status(400).end();
    }

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

> const {body, param, validationResult} = require('express-validator')
> 

param도 유효성 검사에 추가하기

> notEmpty()
> 

req.body의 userId는 값이 있고, 숫자여야 함

## 3. 채널 업데이트

```jsx
router 
    .route('/:id')
    //채널 수정
    .put(
        [param('id').notEmpty().withMessage('아이디 입력 필요'),
        body('name').notEmpty().withMessage('아이디 입력 필요')]
        ,(req,res)=>{
            const err = validationResult(req)

            if(!err.isEmpty()){
                res.status(400).end();
            }

            let {id} = req.params
            id = parseInt(id)
            let {name} = req.body
            let sql = 'UPDATE channels SET name = ? WHERE id = ?'
            let values = [name, id]
        
            conn.query(sql, values, 
                function(err, results){
                    if(err || results.affectedRows == 0){ 
                        return res.status(400).end() 
                    } else {
                        res.status(200).json(results)
                    }
            })
        })
```

> if(err || results.affectedRows == 0){
> 

예외 처리

1. err일 경우
2. results.affectedRow가 0인 경우 (Id가 db에 없는 값이라면,,,)

둘 중에 하나라도 해당되면, 400 띄우도록 세팅

## 4. 채널 삭제

```jsx
  router 
    .route('/:id')
    .delete(
        param('id').notEmpty().withMessage('아이디입력필요')
        ,(req,res)=>{
            const err = validationResult(req)

            if(!err.isEmpty()){
                return res.status(400).json(err.array());
            }

            let {id} = req.params
            id = parseInt(id)
            let sql = 'DELETE FROM channels WHERE id = ?'

            conn.query(sql, id, function(err,results){
                if(err || results.affectedRows == 0){
                    res.status(400).end()
                } else {
                    res.status(200).json(results)
                }
            })
    })
```

## 5. validate 미들웨어

```jsx
    const err = validationResult(req)

    if(!err.isEmpty()){
        return res.status(400).json(err.array())
    }
}
```

모든 채널 api에서 사용되는 유효성 검사 코드를

미들웨어로 생성해서 활용하기

### 5.1 미들웨어 활용

1. 변수에 함수 할당

```jsx
const validate = (req, res)=>{
    const err = validationResult(req)

    if(!err.isEmpty()){
        return res.status(400).json(err.array())
    }
}

```

1. 콜백 함수 이전 코드에 삽입

```jsx
.get([body('userId').notEmpty().isInt().withMessage('숫자입력필요')
, validate]
,(req,res)=>{
```

### 5.2 문제점

validate 함수를 통과해도 이후의 코드를 실행하지 않고

로딩만 진행됨

→ 해결해야 함