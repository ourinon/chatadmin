var createError = require('http-errors');
var debug = require('debug');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session'); 
var flash = require('connect-flash'); 
const passport = require('passport');

//expressLayouts 모듈을 참조한다.
var expressLayouts = require('express-ejs-layouts');

//dotenv 팩키지 구성
require('dotenv').config();

//시퀄라이저 ORM 객체 불러오기
var sequelize = require('./models/index.js').sequelize;

//인증관련 패스포트 개발자 정의 모듈참조,로컬로그인전략적용
const passportConfig = require('./passport/index.js');

//라우터파일 참조
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var boardRouter = require('./routes/board');
var articleRouter = require('./routes/article');
var chatRouter = require('./routes/chat');

var app = express();
//시퀄라이즈 ORM객체를 MYSQL에 연결하고 동기화처리
sequelize.sync();
//패스포트 설정처리
passportConfig(passport);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//ejs-layouts setting
app.set('layout', 'layout');
app.set("layout extractScripts", true);
app.use(expressLayouts);


//서버기능구성하기
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//쿠키파서 구성
app.use(cookieParser(process.env.COOKIE_SECRET));

//express session 활성화
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

//flash 메시지 사용 활성화
app.use(flash());

//패스포트-세션 초기화 : express session 뒤에 설정
app.use(passport.initialize());
app.use(passport.session());

//라우터 URL 맵핑구성
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/board', boardRouter);
app.use('/article', articleRouter);
app.use('/chat', chatRouter);


//404에러 처리기
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//개발모드에서의 에러처리기
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: err
      });
  });
}

//프로덕션모드에서의 에러처리기
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: {}
  });
});


//어플리케이션 웹사이트 포트설정
app.set('port', process.env.PORT || 3001);

//웹어플리케이션 웹사이트 오픈 
var server = app.listen(app.get('port'), function () {
  debug('Express server listening on port ' + server.address().port);
});

//에러 이벤트 처리기설정
server.on('error', onError);

//listening 이벤트 처리기 설정
server.on('listening', onListening);


//전역에러처리기
function onError(error) {
  if (error.syscall !== 'listen') {
      throw error;
  }

  var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
      case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
      case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
      default:
          throw error;
  }
}

//listening 이벤트 처리기
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
