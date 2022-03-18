var express = require('express');
var router = express.Router();
let moment = require('moment');
const db = require('../models/index');
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

var Board = require('../models/index').Board;


//게시판관리 조회 get 방식
router.get('/boards', (req, res, next) => {
    const page={ route:"article",page:"boards",title:"게시판정보조회",description:"게시판정보조회"};
    const searchOption={boardName:req.body.boardName,isUseYN:req.body.searchuseyn};
    
    Board.findAll().then((list)=>{
        console.log(list,"a");
        res.render('board/list',{data : list, moment:moment, page:page, search:searchOption});
    });
});

//게시판관리 조회 post 방식
router.post('/boards', async(req, res, next) => {
    const page={ route:"article",page:"boards",title:"게시판정보조회",description:"게시판정보조회"};
    const searchOption={boardName:req.body.boardName,isUseYN:req.body.searchuseyn};
    let list = await Board.findAll({where:{
        boardName : {[Op.like]:"%"+ req.body.boardName +"%"},
        isUseYN : {[Op.like]:"%"+ req.body.searchuseyn +"%"},
    }});

    return res.render('board/list',{data : list,moment:moment,page:page, search:searchOption});
});

//게시판 신규 등록 get 방식
router.get('/boardManage',(req,res,next)=>{
    const page={ route:"article", page:"boardManage", title:"게시판정보관리",description:"게시판정보관리"};
    let saveMode ="C";

    let board = {
        boardName:"",
        isUseYN:true,
    }
    res.render('board/create',{data : board,moment:moment,saveMode:saveMode,page:page});
});

//게시판 신규 등록 post  방식
router.post('/boardManage',async(req,res)=>{
    let baseDatetime = Date.now();

    
    let board = {
        boardName:req.body.boardname,
        isUseYN:req.body.useyn == "on" ? 1 : 0,
        createdUID:1,
        updatedUID:1,
        createdAt:baseDatetime,
        updatedAt:baseDatetime
    }
    console.log(board);
    await Board.create(board);
    return res.redirect("/board/boards");
});


//게시판 수정 get 방식
router.get('/boardModify',async(req,res)=>{
    const page={ route:"article", page:"boardManage", title:"게시판정보관리",description:"게시판정보관리"};
    const id = req.query.id;
    let saveMode ="M";

    let board = await Board.findOne({where:{id:id}});
    res.render('board/modify',{data : board,moment:moment,saveMode:saveMode,page:page});
});

//게시판 수정 post  방식
router.post('/boardModify',async(req,res)=>{
    let baseDatetime = Date.now();
    const id = req.body.id;
    console.log(id);
    let board = {
        boardName:req.body.boardname,
        isUseYN:req.body.useyn == "on" ? 1 : 0,
        createdUID:1,
        updatedUID:1,
        createdAt:baseDatetime,
        updatedAt:baseDatetime
    }
    console.log(board,"aaaaaaaaaaaaaaaaaaaaaa");

    await Board.update(board,{where:{id:id}});

    return res.redirect("/board/boards");

});




module.exports = router;
  