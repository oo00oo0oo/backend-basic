const express = require('express');
const router = express.Router(); 
const conn = require('./mariadb')
const {body, validationResult} = require('express-validator')


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
router
    .route('/join')
    .post((req,res)=>{
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
router
    .route('/login')
    .post((req,res)=>{
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