var jwt = require('jsonwebtoken'); // 모듈 소환
var dotenv = require('dotenv');

dotenv.config();

var token = jwt.sign({foo:'gyul'}, process.env.PRIVATE_KEY) //  토큰 생성 ( == 서명함)


//console.log(token)

//검증
//검증 성공? -> 페이로드 값 읽을 수 있음
var decoded = jwt.verify(token, process.env.PRIVATE_KEY);
console.log(decoded)
console.log(decoded.foo) // bar