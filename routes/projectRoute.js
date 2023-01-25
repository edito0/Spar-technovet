const express = require('express'); 
const path = require('path'); 
const ejs = require('ejs');
const bodyParser = require('body-parser');
const multer = require('multer');
var cacheService = require("express-api-cache");
var cache = cacheService.cache;


const project_route = express();



project_route.use(bodyParser.json());
project_route.use(bodyParser.urlencoded({extended:true}));

project_route.use(express.static('./public'))

project_route.set('view engine','ejs'); 
project_route.set('views','./views'); 
 



// PROJECT CONTROLER 
const projectController = require('../controllers/projectController');
// PORJECT CONTROLER ENDS



project_route.get('/',cache("10 minutes"),projectController.project);
project_route.get('/:id',cache("10 minutes"),projectController.projectDetial);




module.exports = project_route ;
 
   
