var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');


let moment = require('moment');
const db = require('../models/index');
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

var Admin = require('../models/index').Admin;

//관리자 목록 조회 get 방식
router.get('/list', function(req, res, next) {
    const page={ route:"admin",page:"list",title:"상담원정보조회",description:"상담원정보조회"};
    const searchOption={adminName:"",adminID:"",useYN:""};

    Admin.findAll().then((list)=>{
      res.render('admin/list',{data : list,moment:moment,page:page, search:searchOption});
  });

});

//관리자 목록 조회 post 방식
router.post('/list', async(req,res) => {
  const page={ route:"admin",page:"list",title:"상담원정보조회",description:"상담원정보조회"};
  const searchOption={adminName:req.body.adminname,adminID:req.body.adminid,useYN:req.body.searchuseyn};

  let list = await Admin.findAll({
    where:{
      adminName: {
          [Op.like]: "%" + req.body.adminname + "%"
      },
      adminID:{
        [Op.like]:"%" + req.body.adminid +"%"
      },
      useYN:{
        [Op.like]:"%" + req.body.searchuseyn +"%"
      }
    }
  })
  console.log(req.body.searchuseyn);

  
  return res.render('admin/list',{data : list,moment:moment,page:page, search:searchOption});
});
  
  

//관리자정보관리 
// http://localhost:3001/admin/manager?id=1
router.get('/manager',async(req,res) => {
    //현재 사용중인 view 페이지 정보를 저장한다. layout 페이지에서 사용
    const page={ route:"admin",page:"manager",title:"상담원정보관리",description:"상담원정보관리"};
     const id = req.query.id;
     let admin = {};
     let saveMode ="C";
 
     if(id === undefined){
       admin =
       {
         adminID:"",
         adminPWD:"",
         adminName:"",
         adminEmail:"",
         useYN:true,
       };
       saveMode ="C";
     }else{
       admin =  await Admin.findOne({where:{id:id}});
       admin.adminPWD ="";
       saveMode ="M";
     }
     return res.render('admin/manager',{data : admin,moment:moment,saveMode:saveMode,page:page});
 });
 
 //관리자정보관리
 router.post('/manager',async(req,res) => {
   const id = req.body.id;
   let saveMode = req.body.saveMode;
   let baseDatetime = Date.now();
   let hash = "";
 
   let admin ={};
   console.log("고유번호:",id);
 
   if(saveMode === "C"){
     hash =await bcrypt.hash(req.body.adminpwd, 12);
     admin =  {
       adminID:req.body.adminid,
       adminPWD:hash,
       adminName:req.body.adminname,
       adminEmail:req.body.adminemail,
       useYN:req.body.useyn == "on" ? 1 : 0,
       createdUID:1,
       updatedUID:1,
       createdAt:baseDatetime,
       updatedAt:baseDatetime
     };
 
     await Admin.create(admin);
 
   }else{
 
     if(req.body.adminpwd.length > 0){
       hash =await bcrypt.hash(req.body.adminpwd, 12);
       admin =  {
         adminID:req.body.adminid,
         adminPWD:hash,
         adminName:req.body.adminname,
         adminEmail:req.body.adminemail,
         useYN:req.body.useyn == "on" ? 1 : 0,
         updatedUID:1,
         updatedAt:baseDatetime
       };
     }else{
       admin =  {
         adminID:req.body.adminid,
         adminName:req.body.adminname,
         adminEmail:req.body.adminemail,
         useYN:req.body.useyn == "on" ? 1 : 0,
         updatedUID:1,
         updatedAt:baseDatetime
       };
     }
   
     await Admin.update(
         admin,
         {
           where :{ id : id}
         }
     );
   }
   return res.redirect("/admin/list");
 });
 



module.exports = router;