var express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

var router = express.Router();
var Admin = require('../models/index').Admin;


//메인페이지
router.get('/',isLoggedIn,function(req, res, next) {
  const page={ route:"",page:"index",title:"메인페이지",description:"메인페이지"};
  res.render('index', { title:"메인페이지",user:req.user,page:page});
});

//로그인페이지
router.get('/login',isNotLoggedIn, function(req, res, next) {
  res.render('login',{ layout: 'layoutBlank.ejs',loginError:req.flash('loginError')});
  

});

//로그인처리
router.post('/login',isNotLoggedIn, (req, res,next) => {

  //패스포트 인증처리: 로컬로그인전략 적용
  passport.authenticate('local', (authError, user, info) => {
    //로컬 로그인 전략(localStrategy.js) 수행결과 값이 리턴됨

    //인증에러 발생시
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    
    //사용자 정보가 없으면 에러처리
    if (!user) {
      //localStrategy.js 파일내 DB로그인 검증결과 메시지 출력
      req.flash('loginError', info.message);

      return res.redirect('/login');
    }

    //req.login 메소드 호출 로그인 세션처리
    //req.login 메소드 호출시 passport/index.js내 serializeUser 호출하고 req.session객체 로그인 아이디 저장
    return req.login(user, (loginError) => {
      
      //로그인 에러발생시
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }

      //정상 로그인시 메인페이지 이동
      return res.redirect('/chat/channels');

    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.

});

//외부회원가입신청
router.get('/join',isNotLoggedIn, (req, res, next) => {
  const page={ route:"",page:"join",title:"외부회원가입신청",description:"외부회원가입신청"};
  res.render('join',{ layout: 'layoutBlank.ejs',user:req.user,joinError:req.flash('joinError'),page:page });
});

//외부회원가입요청처리
router.post('/join',isNotLoggedIn, async(req, res, next) => {

  const { adminID, adminPWD, adminName,adminEmail } = req.body;
  const baseDatetime = Date.now();

  try {
    const exAdmin = await Admin.findOne({ where: { adminID } });
    if (exAdmin) {
      req.flash('joinError', '이미 가입된 아이디입니다.');
      return res.redirect('/join');
    }
    const hash = await bcrypt.hash(adminPWD, 12);
    await Admin.create({
      adminID:adminID,
      adminPWD:hash,
      adminName:adminName,
      adminEmail:adminEmail,
      useYN:0,
      createdUID:1,
      updatedUID:1,
      createdAt:baseDatetime,
      updatedAt:baseDatetime
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

//로그아웃
router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
