const express = require('express'); 
const path = require('path'); 
const ejs = require('ejs');
const bodyParser = require('body-parser');
const multer = require('multer');


const admin_route = express();


// SESSION
const session = require('express-session');
const config = require('../config/config.js');

admin_route.use(session({
    secret:config.sessionSecret,
    resave:true, 
    saveUninitialized:true
                              
}));
// SESSION ENDS


// ADMINLOGINAUTH
const adminLogAuth = require('../middlewares/adminLoginAuth');
// ADMINLOGINAUTH ENDS


admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

admin_route.use(express.static('./public'))

admin_route.set('view engine','ejs'); 
admin_route.set('views','./views');  
 

// MULTER 
const storage = multer.diskStorage({
    destination:function(req,file,cb)
    {
        cb(null,path.join(__dirname,"../public/images/original-img"))
    },
    filename:function (req,file,cb) { 
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});

const upload = multer({storage:storage}); 
// MULTER ENDS



// ADMIN CONTROLER 
const adminController = require('../controllers/adminController');
// ADMIN CONTROLER ENDS


 

// LOGIN LOGOUT PAGE
admin_route.get('/',adminLogAuth.isLogout,adminController.login);
admin_route.get('/logout',adminLogAuth.isLogin,adminController.logout);
admin_route.post('/',adminController.loginSave);
// LOGIN LOGOUT ENDS

// HOME PAGE  
admin_route.get('/edithome',adminLogAuth.isLogin,adminController.editHome);
admin_route.post('/edithome',upload.single('image'),adminLogAuth.isLogin,adminController.postEditHome);
admin_route.post('/deletehomedata',adminLogAuth.isLogin,adminController.deleteHomeData);
// HOME PAGE ENDS


// ABOUT PAGE 
admin_route.get('/editabout',adminLogAuth.isLogin,adminController.editAbout);
admin_route.post('/editabout',upload.single('image'),adminLogAuth.isLogin,adminController.postEditAbout);
admin_route.post('/deleteaboutdata',adminLogAuth.isLogin,adminController.deleteAboutData);
// ABOUT PAGE ENDS  
 

// SERVICES PAGE
admin_route.get('/editservices',adminLogAuth.isLogin,adminController.editServices);
admin_route.post('/editservices',upload.single('image'),adminLogAuth.isLogin,adminController.postEditServices);
admin_route.post('/deleteservicesdata',adminLogAuth.isLogin,adminController.deleteServicesData);
// SERVICES PAGE ENDS


// PROJECT PAGE
admin_route.get('/editprojects',adminLogAuth.isLogin,adminController.editProjects);
admin_route.post('/editprojects',upload.array('image',9),adminLogAuth.isLogin,adminController.postEditProject); 
admin_route.post('/deleteprojectsdata',adminLogAuth.isLogin,adminController.deletePorjectData);
// PROJECT PAGE ENDS 

// ANALYTICS
admin_route.get('/analytics',adminLogAuth.isLogin,adminController.analytics);
// ANALYTICS ENDS 


//MEDIA PAGE
admin_route.get('/editmedia',adminLogAuth.isLogin,adminController.editmedia);
admin_route.post('/editmedia',adminLogAuth.isLogin,adminController.postEditMedia); 
admin_route.post('/deletemediadata',adminLogAuth.isLogin,adminController.deleteMediaData);
// MEDIA PAGES ENDS




//FORGET PASSWORD PAGE
admin_route.get('/forget-password',adminLogAuth.isLogout,adminController.forgetPassword);
admin_route.post('/forget-password',adminLogAuth.isLogout,adminController.forgetPasswordVerify);
admin_route.get('/reset-password',adminLogAuth.isLogout,adminController.resetPassword);
admin_route.post('/reset-password',adminLogAuth.isLogout,adminController.PostResetPassword);
//FORGET PASSWORD PAGE ENDS


module.exports = admin_route;
 
   




 