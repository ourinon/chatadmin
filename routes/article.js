var express = require('express');
var router = express.Router();
let moment = require('moment');
const db = require('../models/index');
var Articles = require('../models/index').Articles;
var Board = require('../models/index').Board;
var Announcement = require('../models/index').Announcement;
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

//게시판 관리 조회 get 방식
router.get('/articles', async(req, res, next) => {
    const page={ route:"article",page:"article",title:"상담원정보조회",description:"상담원정보조회"};
    const searchOption = {
      boardIDX:req.body.boardIDX,
      title:req.body.title,
      displayYn:req.body.displayYn
    };
    let boards = await Board.findAll();
    let list = await Articles.findAll({
      include:[{
        model:Board,
      }]
    });
    res.render('article/list',{data : list, moment:moment, boards, page:page,  search:searchOption});
});

//게시판 관리 조회 post 방식
router.post('/articles', async(req, res, next) => {
  const page={ route:"article",page:"article",title:"상담원정보조회",description:"상담원정보조회"};
  const searchOption = {
    boardIDX:req.body.boardIDX,
    title:req.body.title,
    displayYn:req.body.displayYn
  };

  let boards = await Board.findAll();
  let list = await Articles.findAll({
    include:[{
      model:Board,
    }],
    where:{
      boardIDX:{
        [Op.like]:"%"+ req.body.boardIDX +"%"
      },
      title:{
        [Op.like]:"%"+ req.body.title +"%"
      },
      displayYn:{
        [Op.like]:"%"+ req.body.displayYn +"%"
      },

    }
  });

  res.render('article/list',{data : list, moment:moment, boards, page:page, search:searchOption});

});

//게시판 신규 등록 및 수정 get 방식
router.get('/create',async(req,res) => {
  
  //계정 연동 request 정보 
  let userid = req.query.userid
  let username = req.query.username
  let ANNUALPAUSE  = "";
  let AUTHORITY = "";
  if (userid==undefined){
    userid = req.body.userid;
  }
  console.log("아이디",userid);
    let announcement = [];
    announcement = await Announcement.findAll({ where: { usedYN: "1", }, order: [["num", "ASC"]]});
    // console.log(announcement);

    return res.render('article/manager',{data : announcement, userid:userid});

 });
 

//게시판 신규 등록 및 수정 post 방식
 router.post('/create',async(req,res) => {
  const id = req.body.id;
  // let saveMode = req.body.saveMode;
  let baseDatetime = Date.now();
  let ment01 = req.body.ment01;
  let ment02 = req.body.ment02;
  let ment03 = req.body.ment03;
  let ment04 = req.body.ment04;

  //계정 연동 request 정보 
  let userid = req.query.userid
  let username = req.query.username
  let ANNUALPAUSE  = "";
  let AUTHORITY = "";
  if (userid==undefined){
    userid = req.body.userid;
  }
  console.log(userid);
//   //임시
//   if (userid == null){
//     userid = 1;
//   }
//   if (username == null){
//     username = "상담사1";
//   }
// console.log("아이디",userid); 

  try {
    userinfo = await sequelize.query('CALL SelectChatUserCheck (:P_userid)', { replacements: { P_userid: userid } });
    //console.log("유저정보:",userinfo);
    if (userinfo !== null){
      username = userinfo[0].USERNAME;
      ANNUALPAUSE  = userinfo[0].ANNUALPAUSE ;
      AUTHORITY  = userinfo[0].AUTHORITY ;
    }
  } catch (error) {
    console.log("서버에러:", error);
  }
  //전체 업데이트 
  // await Announcement.update({usedYN: false});

  // announcement = await Announcement.findAll({ where: { usedYN: "1", }, order: [["num", "ASC"]]});
  // console.log(announcement);
  // if (announcement != null){
  //   await Announcement.update(
  //     {
  //       usedYN: 0,
  //     },
  //   )

  // }

  await Announcement.update({usedYN: '0'}, {where: {usedYN: '1'}});
  
  if (ment01 != null && ment01 != ''){
    await Announcement.create(
      {
        num: 1
        , mentTypeCode: 0
        , contents: ment01
        , usedYN: 1
        , createdUID: 1
        , updatedUID: 1
    })
  }
  if (ment02 != null && ment02 != ''){
    await Announcement.create(
      {
        num: 2
        , mentTypeCode: 0
        , contents: ment02
        , usedYN: 1
        , createdUID: 1
        , updatedUID: 1
    })
  }
  if (ment03 != null && ment03 != ''){
    await Announcement.create(
      {
        num: 2
        , mentTypeCode: 0
        , contents: ment03
        , usedYN: 1
        , createdUID: 1
        , updatedUID: 1
    })
  }
  if (ment04 != null && ment04 != ''){
    await Announcement.create(
      {
        num: 2
        , mentTypeCode: 0
        , contents: ment04
        , usedYN: 1
        , createdUID: 1
        , updatedUID: 1
    })
  }
  // .then(result => {
  //    res.json(result);
  // })
  // .catch(err => {
  //    console.error(err);
  // });

  // Announcement.create({userID: '유저ID', password: '유저PW'})
  // .then(result => {
  //    res.json(result);
  // })
  // .catch(err => {
  //    console.error(err);
  // });

  //  console.log("고유번호:",id);
 
  //   announcement =  {
  //     num:req.body.ment01,
  //     mentTypeCode:0,
  //     contents:req.body.contents,
  //     createdUID:1,
  //     updatedUID:1,
  //     createdAt:baseDatetime,
  //     updatedAt:baseDatetime
  //    };
 
  //    await Announcement.create(article);
 
    return res.redirect("/article/create?userid="+userid);
    
 });
 




module.exports = router;
  