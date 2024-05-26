const express = require('express')
const router = express.Router()
const conn = require('./mariadb')
const {body, param, validationResult} = require('express-validator')

router.use(express.json())

const validate = (req, res, next)=>{
    const err = validationResult(req)

    if(err.isEmpty()){
        return next(); // 다음 할 일 하러 찾으러 가봐!
    } else {
        return res.status(400).json(err.array())
    }
}



router
    .route('/')
    // 채널 생성
    .post(
        [
            body('userId').notEmpty().isInt().withMessage('숫자입력필요'), 
            body('channelName').notEmpty().isString().withMessage('문자입력필요'), 
            validate
        ]
        , (req,res, next)=>{

            const {channelName, userId} = req.body
            let sql = 'INSERT INTO channels (name, user_id) VALUES (?, ?)'
            let values = [channelName, userId]

            conn.query(sql, values,
                function(err, results){
                    if(err){
                        console.log(err)
                        return res.status(400).end();
                    } else {
                    res.status(201).json(results)
                    }
                }
            )

    })


    // 채널 전체 조회
    .get(
        [
            body('userId').notEmpty().isInt().withMessage('숫자입력필요'),
            validate
        ]
        ,(req,res, next)=>{

            let sql = 'SELECT * FROM channels WHERE user_id = ?'
            let {userId} = req.body

            conn.query(sql, userId, function(err, results){
                if(err){
                    res.status(400).end();
                }
                if(results.length){
                    return res.status(200).json(results)
                } else {
                    return notFoundChannel(res)
                }
        }) 
})

router 
    .route('/:id')
    //채널 수정
    .put(
        [
            param('id').notEmpty().withMessage('아이디 입력 필요'),
            body('name').notEmpty().withMessage('아이디 입력 필요'), 
            validate
        ]
        ,(req,res, next)=>{
           

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

    // 채널 삭제
    .delete(
        [
            param('id').notEmpty().withMessage('아이디입력필요'), 
            validate
        ]
        ,(req,res, next)=>{
           
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

    // 채널 개별 조회
    .get(
        [
            param('id').notEmpty().withMessage('아이디 입력 필요'),
            validate
        ]
        ,(req,res, next)=>{

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

function notFoundChannel(res){
    res.status(404).json({
        message: "채널 정보를 찾을 수 없습니다."
    })
}

module.exports = router;
