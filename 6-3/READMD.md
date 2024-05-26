## 1. cookie 사용해보기

npm cookie 중에서 cookie-parser 사용하기

request에서의 쿠키를 파싱할 때 필요함

그냥 request에서 오는 거 처리 안 할거면 필요없지만 보통 다 필요하니까, 미리 설치하기

[npm: cookie-parser](https://www.npmjs.com/package/cookie-parser)

### 1.1 cookie

쿠기로 보내기

```jsx
res.cookie('token', token)
```

![Screenshot 2024-05-22 at 3.18.57 PM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/e67b413d-4bb2-4526-b1a4-a2aec7218637/afe60077-eb57-42aa-917a-b499f64fc581/Screenshot_2024-05-22_at_3.18.57_PM.png)

### 1.2 401, 403, 404

4XX은 클라이언트에서의 오류를 나타내는 상태 코드

- **401 Unauthorized**
    - 인증이 안된 상태. 사용자 로그인이 필요함
- **403 Forbidden**
    - 서버가 요청은 이해했으나, 승인을 거부한 상태.
    - 주로 인증될 자격은 있으나 인가될 자격은 없는 경우(접근 권한 불충분)
- **404 Not Found**:
    - 요청 리소스가 서버에 없는 경우에 발생함.

## 2. HTTP, HTTPS, HTTPonly, 설정

### 2.1 HTTP vs HTTPS 간단 비교

> 보안
> 

HTTP는 plain text로 데이터 전송

HTTPS는 SSL, TLS를 이용해서 데이터 암호화를 한 후 전송

> 포트 넘버(default)
> 

HTTP - 80

HTTPS - 443

> SEO, browser indication
> 

HTTP - 가끔 구글링하면 NOT SECURE이라며 사용자에게 사이트 이용을 경고하는 경우 발생하는데, 모든 브라우저가 HTTP보다 HTTPS를 신뢰하고 주로 사용하기 때문임

HTTPS - 선호됨, 자물쇠모양 아이콘으로 표시됨

### 2.2 HTTPOnly

프론트엔드가 아니라 API 호출만 가능하도록 허락하는 경우

왜? XSS(웹 브라우저 JS 접근 후 공격)을 막기 위해서

cookie 전송하면서 설정하면 됨

```jsx
res.cookie('token', token, {
    httpyOnly: true
})
```

## 3. 유효 기간, 이슈어 설정

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
                            name: loginUser.name}, process.env.LOGIN_KEY, {
                                expiresIn : '30m',
                                issuer : 'daeun'
                            })

                        res.cookie('token', token, {
                            httpyOnly: true
                        })

                        console.log(token)

                        res.status(200).json({
                            message: `${loginUser.name}님 로그인되었습니다.`
                        })
                    } else {
                        res.status(403).json({
                            message: "이메일 또는 비밀번호 정보가 틀렸습니다."
                        })
                    }
                }
            )
```

JWT로 디코딩해보면, 

{
"email": "[ga@gmail.com](mailto:ga@gmail.com)",
"name": "gagaga",
"iat": 1716705058,
"exp": 1716706858,
"iss": "daeun"
}

이런 식으로, iat(issuedat), exp(expiration), iss(issuer) 확인 가능