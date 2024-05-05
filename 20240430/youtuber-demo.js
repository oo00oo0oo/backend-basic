const express = require('express');
const app = express();

app.listen(3000);


// data setting
const youtuber1 = {
    channelTitle : 'MBCnews',
    sub : '434만명',
    videoNum : '24만개'

}

const youtuber2 = {
    channelTitle : 'essential',
    sub : '137만명',
    videoNum : '391개'

}

const youtuber3 = {
    channelTitle : '뉴진스',
    sub : '600만명',
    videoNum : '500개'
}


const db = new Map();
let id = 1;
db.set(id++, youtuber1)
db.set(id++, youtuber2)
db.set(id++, youtuber3)

console.log(db)




// json 파싱
app.use(express.json());


//REST API 설계
// 전체 유튜버 조회
app.get("/youtubers", function(req,res){
    var youtubers = {}
    db.forEach(function(value,key){
        youtubers[key] = value
    });

    res.json(youtubers)
})

// 개별 유튜버 조회
app.get('/youtubers/:id', function(req, res){
    // API URL은 복수로 하는게 통일감 부여 가능
    let {id} = req.params
    id = parseInt(id)
    const youtuber = db.get(id)


    if (youtuber == undefined){
        res.json({
            message: '유튜버 정보를 찾을 수 없습니다'
        })
    } else {
        res.json(youtuber)
    }
})


// 개별 유튜버 추가하기(직접 작업)
// app.post('/youtuber/:id', function(req,res){
//     let {id} = req.params
//     id = parseInt(id)

//     db.set(id, req.body)
//     console.log(db)

//     res.json(db.get(id))
// })

// 개별 유튜버 추가
app.post('/youtubers', (req,res)=>{
    console.log(req.body)
    // API URL은 복수로 하는게 통일감 부여 가능
    db.set(id++, req.body)

    res.json({
        message: `${db.get(id-1).channelTitle}님, 유튜버 생활을 응원합니다!`
    })
})


// 개별 유튜버 삭제하기, delete(직접 작업)
// app.delete('/youtubers/:id', (req,res)=>{
//     let {id} = req.params
//     id = parseInt(id)
//     const delId = db.get(id)
//     const channeltitle1 = delId.channelTitle
//     console.log(channeltitle1)
//     db.delete(id)

//     res.json({
//         message: `${channeltitle1}님, 바이바이`
//     })

// })


// 개별 유튜버 삭제하기
app.delete('/youtubers/:id', (req,res)=>{
    let {id} = req.params
    id = parseInt(id)


    var youtuber = db.get(id) // 중복 방지, 변수 사용
    //예외처리
    if (youtuber == undefined){
        res.json({
            message: `요청하신 ${id}는 없는 유튜버입니다.`
        })
    } else {
        const channelTitle = youtuber.channelTitle
        db.delete(id)

        res.json({ 
            message: `${channelTitle}님, 아쉽지만 우리 인연은 여기가지 인가요?`
        })
    }  
})



// 전체 유튜버 삭제하기
// app.delete('/youtubers', (req,res)=>{
//     db.forEach((x)=> db.delete(x))
//     console.log(db.keys.length)
//     if (db.keys.length == 0){
//         res.json({
//             message: "?"
//         })
//     } else {
//         res.json({
//             message: '전체 유튜버가 삭제되었습니다.'
//         })
//     }
// })

app.delete('/youtubers', (req,res)=>{
    
    let msg = ""

    if (db.size >= 1){
        db.clear();
        msg = "전체 유튜버가 삭제되었습니다."
    } else {
        msg = '삭제할 유튜버가 없습니다.'
    }

    res.json({
        message: msg
    })
})

//개별 유튜버 수정하기 (먼저 작업)
// app.put('/youtubers/:id', (req,res)=>{
//     let {id} = req.params
//     id = parseInt(id)

//     const ori_id = db.get(id).channelTitle
//     let title = db.get(id).channelTitle

//     title = req.body.channelTitle
//     res.json({
//         messsage: `${ori_id}님, 채널명이 ${title}로 변경되었습니다.`
//     })
// })


//개별 유튜버 수정하지
app.put('/youtubers/:id', (req,res)=>{
    let {id} = req.params
    id = parseInt(id)

    var youtuber = db.get(id)
    var oldTitle = youtuber.channelTitle
    if (youtuber == undefined){
        res.json({
            message: `요청하신 ${id}번은 없는 유튜버입니다.`
        })
    } else {
        var newTitle = req.body.channelTitle
        youtuber.channelTitle = newTitle
        db.set(id, youtuber)

        res.json({
            messsage: `${oldTitle}님, 채널명이 ${newTitle}로 변경되었습니다.`
        })
    }
})

