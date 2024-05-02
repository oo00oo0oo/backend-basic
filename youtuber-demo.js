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

// 개별 유튜버 추가
app.post('/youtubers', (req,res)=>{
    // API URL은 복수로 하는게 통일감 부여 가능
    db.set(id++, req.body)
    console.log(db)

    res.json({
        message: `${db.get(id-1).channelTitle}님, 유튜버 생활을 응원합니다!`
    })
})

// 유튜버 추가하기(직접 작업)
// app.post('/youtuber/:id', function(req,res){
//     let {id} = req.params
//     id = parseInt(id)

//     db.set(id, req.body)
//     console.log(db)

//     res.json(db.get(id))
// })


//REST API 설계
// 전체 유튜버 조회
app.get("/youtubers", function(req,res){
    res.json({
        message: 'test'
    })
})

// 개별 유튜버 조회
app.get('/youtuber/:id', function(req, res){
    // API URL은 복수로 하는게 통일감 부여 가능
    let {id} = req.params
    id = parseInt(id)
    const youtuber = db.get(id)

    if (db.get(id) == undefined){
        res.json({
            message: '유튜버 정보를 찾을 수 없습니다'
        })
    } else {
        res.json(youtuber)}
})

