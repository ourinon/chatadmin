const local = require('./localStrategy');
const { Admin } = require('../models');

module.exports = (passport) => {

  //로그인한 사용자의 기본정보만 req.session객체에 저장
  //req.login()메소드 호출시 자동 호출됨.
  passport.serializeUser((user, done) => {
    //req.session 객체에 저장할 로그인 사용자의 기초 데이터 세팅
    //저장할 관리자 세션의 기본정보세팅
    done(null, user.adminID);

  });

  //매 요청시마다 실행 : app.js내 passport.session()미들웨어에서 호출
  //필요한 경우 로그인한 관리자의 풀정보를 조회하여 사용할수 있는 기능제공
  passport.deserializeUser((id, done) => {
    
    //req.session에 저장된 관리자 아이디를 이용 DB에서 해당 관리자 풀정보조회후 req.user객체에 저장
    Admin.findOne({ where: { adminID : id } })
      .then(user => done(null, user))
      .catch(err => done(err));

  });

  local(passport);

};
