const path = require('path');
const Sequelize = require('sequelize')

// const env = process.env.NODE_ENV || 'development';
const env = process.env.NODE_ENV || 'test';
//const env = process.env.NODE_ENV || 'production';
const config = require(path.join(__dirname,'..','config','config.json'))[env];
//console.log(config)
//DB관리 객체 생성
const db ={};
const sequelize = new Sequelize(config.database,config.username,config.password,config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Admin = require('./admin')(sequelize,Sequelize);
//db.Board = require('./board')(sequelize,Sequelize);
//db.Article = require('./article')(sequelize,Sequelize);
//db.ArticleFile = require('./articlefile')(sequelize,Sequelize);

db.ChattingService = require('./chattingservice')(sequelize, Sequelize);
db.ChattingLog = require('./chattinglog')(sequelize, Sequelize);
db.ChattingBlocking = require('./chattingblocking')(sequelize, Sequelize);
db.Board = require('./board')(sequelize,Sequelize);
db.Articles = require('./articles')(sequelize,Sequelize);
db.Announcement = require('./announcement')(sequelize,Sequelize);


db.Board.hasMany(db.Articles,{foreignKey: 'boardIDX', sourceKey:'id'});
db.Articles.belongsTo(db.Board,{foreignKey:'boardIDX',targetKey:'id'});


//db.Board.hasMany(db.Article);
//db.Article.belongsTo(db.Board);

//db.Article.hasMany(db.ArticleFile);
//db.ArticleFile.belongsTo(db.Article);


//DB관리객체 모듈 출력
module.exports = db;

