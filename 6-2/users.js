const express = require('express');
const router = express.Router(); 
const conn = require('./mariadb');
const {body, validationResult} = require('express-validator');
router.use(express.json());
const jwt = require('jsonwebtoken');

const validate = (req, res, next)=>{
    const err = validationResult(req)

    if(err.isEmpty()){
        return next(); 
    } else {
        return res.status(400).json(err.array())
    }
}



// 회원 개별 조회
router
    .route('/users')
    .get(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 입력 필요'), 
            validate
        ]
        ,(req, res, next) => {

            let { email } = req.body;
            let sql = "SELECT * FROM users WHERE email = ?"

            conn.query(sql, email,
                function (err, results) {
                    if(err){
                        res.status(400).end();
                    } else {
                        res.status(200).json(results)
                    }
                }
            )
    })

// 회원 개별 삭제    
    .delete(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 입력 필요'), 
            validate
        ]
        ,(req,res, next)=>{
            let { email } = req.body
            let sql = "DELETE FROM users WHERE email = ?"


            conn.query(sql, email, function(err,results){
                if(err || results.affectedRows == 0){
                    res.status(400).end()
                } else {
                    res.status(200).json(results)
                }
            })
    })


// 회원가입
router
    .route('/join')
    .post(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 입력 필요'),
            body('name').notEmpty().isString().withMessage('이름 입력 필요'),
            body('password').notEmpty().isString().withMessage('비밀번호 입력 필요'),
            body('contact').notEmpty().isInt().withMessage('전화번호 입력 필요'),
            validate
        ]
        ,(req,res, next)=>{

            let { email, name, password, contact } = req.body
            let sql = 'INSERT INTO users (email, name, password, contact) VALUES (?,?,?,?)'
            let values = [email, name, password, contact]

            conn.query(sql, values,
                function(err, results){
                    if (err){
                        res.status(400).end()
                    } else {
                        res.status(201).json(results)
                    }
                })
        })
 
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

module.exports = router