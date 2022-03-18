var express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

var moment = require('moment');
const db = require('../models/index');
const sequelize = db.sequelize;
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

var ChattingService = require('../models/index').ChattingService;

var router = express.Router();

const path = require('path');
// const env = process.env.NODE_ENV || 'development';
const env = process.env.NODE_ENV || 'test';
//const env = process.env.NODE_ENV || 'production';
const config = require(path.join(__dirname,'..','config','config.json'))[env];

const adminsitehost = config.adminsitehost;
const adminsiteport = config.adminsiteport;
const chatsitehost = config.chatsitehost;
const chatsiteport = config.chatsiteport;

const siteconfig = {
  "adminsitehost": adminsitehost,
  "adminsiteport": adminsiteport,
  "chatsitehost": chatsitehost,
  "chatsiteport": chatsiteport,
}

//채팅방목록조회
router.get('/channels', isNotLoggedIn, async (req, res, next) => {
  const page = { route: "chat", page: "channels", title: "채팅방목록조회", description: "채팅방목록조회" };
  let chatRoomName = "";
  let chatRoomDescription = "";
  let openState = "";
  let channels = [];

  //계정 연동 request 정보 
  // let userid = req.body.userid;
  let userid = req.query.userid
  let username = req.query.username
  if (userid==undefined){
    userid = req.body.userid;
  }
  console.log(userid);
  // let username = req.body.username;
  let ANNUALPAUSE  = "";
  let AUTHORITY = "";
  // console.log(userid)
  
  // //임시
  // if (userid == null){
  //   userid = 1;
  // }
  // if (username == null){
  //   username = "상담사1";
  // }

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

  try {
    channels = await sequelize.query('CALL SelectChatChannelSearch (:channelID,:channelName,:openState)', { replacements: { channelID: chatRoomName, channelName: chatRoomDescription, openState: openState } });
    //console.log("채널목록:",channels);
  } catch (error) {
    console.log("서버에러:", error);
  }
  res.render('chat/channels', { 
    data: channels
    , moment: moment
    , chatRoomName: chatRoomName
    , chatRoomDescription: chatRoomDescription
    , openState: openState
    , userid:userid
    , username:username
    , page: page 
    , siteconfig : siteconfig 
    , AUTHORITY: AUTHORITY
  });
});

//채팅방목록조회
router.post('/channels', isNotLoggedIn, async (req, res, next) => {
  const page = { route: "chat", page: "channels", title: "채팅방목록조회", description: "채팅방목록조회" };
  let chatRoomName = '';
  let chatRoomDescription = '';
  let openState = req.body.openState;
  let channels = [];

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


  try {
    channels = await sequelize.query('CALL SelectChatChannelSearch (:channelID,:channelName,:openState)', { replacements: { channelID: chatRoomName, channelName: chatRoomDescription, openState: openState } });
    console.log("데이터목록2:",channels);
  } catch (error) {
    console.log("서버에러:", error);
  }
//   res.render('chat/channels', { data: channels, moment: moment, chatRoomName: chatRoomName, chatRoomDescription: chatRoomDescription, openState: openState, page: page });
// });
console.log(userid)
res.render('chat/channels', { 
  data: channels
  , moment: moment
  , chatRoomName: chatRoomName
  , chatRoomDescription: chatRoomDescription
  , openState: openState
  , userid:userid
  , username:username
  , page: page 
  , siteconfig : siteconfig 
  , AUTHORITY : AUTHORITY
});
});


//채팅로그목록조회
router.get('/logs', isNotLoggedIn, async (req, res, next) => {
  const page = { route: "chat", page: "logs", title: "채팅로그목록조회", description: "채팅로그목록조회" };

  let channels = await ChattingService.findAll();
  let logs = [];
  let counselNum = "";
  let counselId = "";
  let age = "";
  let region = "";
  let type = "";
  let startDate = "";
  let endDate = "";

  const params = {
    "counselNum": counselNum,
    "counselId": counselId,
    "age": age,
    "region": region,
    "type": type,
    "startDate": startDate,
    "endDate": endDate,
  }
  let searchType_age = [];
  let searchType_region = [];
  let searchType_type = []; 

  searchType_age = await SelectChatLogTypeSearch('age');
  searchType_region = await SelectChatLogTypeSearch('region');
  searchType_type = await SelectChatLogTypeSearch('type');

  if (searchType_age == undefined){
    searchType_age = [];
  }
  if (searchType_region == undefined){
    searchType_region = [];
  }
  if (searchType_type == undefined){
    searchType_type = [];
  }
// console.log(searchType_type);
  logs = await SelectChatLogSearch(params);
  // console.log(logs);

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

  res.render('chat/logs'
  , { 
      data: logs
    , moment: moment
    , channels
    , counselNum : counselNum
    , counselId : counselId
    , age : age
    , region : region
    , type : type
    , startDate :startDate
    , endDate : endDate
    , page: page 
    , searchType_age : searchType_age 
    , searchType_region : searchType_region 
    , searchType_type : searchType_type 
    , userid:userid
  });

});

//채팅로그목록조회
router.post('/logs', isNotLoggedIn, async (req, res, next) => {
  const page = { route: "chat", page: "logs", title: "채팅로그목록조회", description: "채팅로그목록조회" };

  let channels = await ChattingService.findAll();
  let logs = [];
  let counselNum = req.body.counselNum;
  let counselId = req.body.counselId;
  let age = req.body.age;
  let region = req.body.region;
  let type = req.body.type;
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;

  const params = {
    "counselNum": counselNum,
    "counselId": counselId,
    "age": age,
    "region": region,
    "type": type,
    "startDate": startDate,
    "endDate": endDate,
  }

  logs = await SelectChatLogSearch(params);

  let searchType_age = [];
  let searchType_region = [];
  let searchType_type = []; 

  searchType_age = await SelectChatLogTypeSearch('age');
  searchType_region = await SelectChatLogTypeSearch('region');
  searchType_type = await SelectChatLogTypeSearch('type');

  if (searchType_age == undefined){
    searchType_age = [];
  }
  if (searchType_region == undefined){
    searchType_region = [];
  }
  if (searchType_type == undefined){
    searchType_type = [];
  }
  
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

  res.render('chat/logs'
  , { 
      data: logs
    , moment: moment
    , channels
    , counselNum : counselNum
    , counselId : counselId
    , age : age
    , region : region
    , type : type
    , startDate :startDate
    , endDate : endDate
    , page: page 
    , searchType_age : searchType_age 
    , searchType_region : searchType_region 
    , searchType_type : searchType_type 
    , userid : userid
  });
});


router.get("/:id", isNotLoggedIn, async (req, res) => {
  
  const chatnum = req.params.id;
  try {
    const data = await SelectChatLog(chatnum);
    // console.log(data);
    return res.json({ code: 200, data: data, msg: "Ok" });
  } catch (error) {
    return res.json({ code: 500, data: {}, msg: "서버에러 발생" });
  }
});


/**[상담내역 채팅 로그]
 * 
 * @author <Create> : 2021-11-15 
 * @version 1
 * @param {Object} params 파라미터 변수
 * @listens SelectChatLogSearch
 * @desc 상담 내역을 DATABASE 에서 갖고 옵니다.
 */
 async function SelectChatLog(param){

  let results = [];
  let querySP = "CALL SelectChatLog ";
  let queryParam = "";
  queryParam += "(";
  queryParam += ":P_chatRoomName";
  queryParam += ")";

  try 
  {
    results = await sequelize.query(querySP + queryParam
      , { 
        replacements: { 
          P_chatRoomName : param
        } 
      });

  }catch(error){
    console.log("서버에러:", error);
  }

  return results;
}

/**[상담내역 데이터]
 * 
 * @author <Create> : 2021-11-15 
 * @version 1
 * @param {Object} params 파라미터 변수
 * @listens SelectChatLogSearch
 * @desc 상담 내역을 DATABASE 에서 갖고 옵니다.
 */
 async function SelectChatLogSearch(params){

  let results = [];
  let counselNum = params.counselNum;
  let counselId = params.counselId;
  let age = params.age;
  let region = params.region;
  let type = params.type;
  let startDate = params.startDate;
  let endDate = params.endDate;

  let querySP = "CALL SelectChatLogSearch ";
  let queryParam = "";
  queryParam += "(";
  queryParam += ":P_counselNum,";
  queryParam += ":P_counselId,";
  queryParam += ":P_age,";
  queryParam += ":P_region,";
  queryParam += ":P_type,";
  queryParam += ":P_startDate,";
  queryParam += ":P_endDate";
  queryParam += ")";

  try 
  {
    results = await sequelize.query(querySP + queryParam
      , { 
        replacements: { 
          P_counselNum : counselNum
          , P_counselId : counselId
          , P_age : age
          , P_region : region
          , P_type : type
          , P_startDate : startDate
          , P_endDate : endDate
        } 
      });

  }catch(error){
    console.log("서버에러:", error);
  }

  return results;
}

/**[상담내역 검색 조건]
 * 
 * @author <Create> : 2021-11-15 
 * @version 1
 * @param {Object} params 파라미터 변수
 * @listens SelectChatLogSearch
 * @desc 상담 검색조건 필터 옵션 값을 DATABASE 에서 갖고 옵니다.
 */
 async function SelectChatLogTypeSearch(param){
  let results = [];
  let querySP = "CALL SelectChatLogTypeSearch ";
  let queryParam = "";
  queryParam += "(";
  queryParam += ":P_searchType";
  queryParam += ")";

  try 
  {
    results = await sequelize.query(querySP + queryParam
      , { 
        replacements: { 
          P_searchType : param
        } 
      });

  }catch(error){
    console.log("서버에러:", error);
  }
  // console.log(results)

  return results;
}

module.exports = router;