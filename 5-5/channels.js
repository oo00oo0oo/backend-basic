const express = require('express');
const router = express.Router();
const conn = require('./mariadb')

router.use(express.json());

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


    // 채널 전체 조회
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

