//로컬 로그인 전략 기능 정의 
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const { Admin } = require('../models');

module.exports = (passport) => {

  //req.body내 비교 아이디/암호 html요소이름을 지정  
  passport.use(new LocalStrategy({
    usernameField: 'adminID',
    passwordField: 'adminPWD',
  }, async (adminID, adminPWD, done) => {
    try {
      
      //로그인 화면에서 전달된 아이디/암호를 이용 DB사용자와 검증  
      //done함수는 passport.authenticate의 콜백함수임
      //관리자정보조회
      const exUser = await Admin.findOne({ where: { adminID } });

      if (exUser) {

        const result = await bcrypt.compare(adminPWD, exUser.adminPWD);
        
        if (result) {

            //관리자 정보 전달
            done(null, exUser);

        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }

      } else {
        done(null, false, { message: '아이디가 존재하지 않습니다.' });
      }

    } catch (error) {
      console.error(error);
      done(error);
    }
  }));

};
