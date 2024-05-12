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

