const express = require('express');
const app = express();

app.listen(7777);
app.use(express.json());


const db = new Map();
let num = 1;

// (추가) app.route 사용해보기
// .get과 .delete가 path가 동일하니까, route로 동일하게 합쳐서 사용 가능
app
    .route('/users/:id')
    .get((req,res)=>{
        let {id} = req.params
        id = parseInt(id)
    
        const user = db.get(id)
        if (user){
            res.status(200).send({
                id: user.id,
                name: user.name
            })
        } else {
            res.status(400).send({
                message: '없는 아이디 정보입니다.'
            })
        }
    })
    .delete((req,res)=>{
        let {id} = req.params
        id = parseInt(id)
    
        const user = db.get(id)
        if (user){
            let name = user.name
            db.delete(id)
            res.json({
                message: `${name}님, 다음에 또 뵙겠습니다.`
            })
        } else {
            res.status(404).send({
                message: `없는 정보입니다.`
            })
        }
    })

// 회원가입
app.post('/join', (req,res)=>{
    let user = req.body

    if (user.id && user.pw && user.name){
        db.set(num++, user)
        console.log(db)

        res.status(201).send({
            message: `${db.get(num-1).name}님 회원가입을 환영합니다`
        })
    } else {
        res.status(400).send({
            message: '다시 입력해주세요'
        })  
    }
})



console.log(db)


// 로그인
app.post('/login', (req,res)=>{
    
    let user = req.body
    let id = user.id
    let pw = user.pw
    var key = 0;

    db.forEach(function(value, x){
        if(value.id == id && value.pw == pw){
            key = x;
            return;
        }
    })
 
    console.log(key)
    console.log(db)

    if (key){
        res.json({
            message: `${db.get(key).name}님 환영합니다`
        })
    } else {
        res.status(400).send({
            message: '회원 정보가 맞지 않습니다'
        })
    }
})


// 회원 개별 조회
// app.get('/users/:id', (req,res)=>{
//     let {id} = req.params
//     id = parseInt(id)

//     const user = db.get(id)
//     if (user){
//         res.status(200).send({
//             id: user.id,
//             name: user.name
//         })
//     } else {
//         res.status(400).send({
//             message: '없는 아이디 정보입니다.'
//         })
//     }
// })


// 회원 개별 탈퇴
// app.delete('/users/:id', (req,res)=>{
//     let {id} = req.params
//     id = parseInt(id)

//     const user = db.get(id)
//     if (user){
//         let name = user.name
//         db.delete(id)
//         res.json({
//             message: `${name}님, 다음에 또 뵙겠습니다.`
//         })
//     } else {
//         res.status(404).send({
//             message: `없는 정보입니다.`
//         })
//     }
// })

// console.log(db)