const mongoose = require('mongoose');

const projectSettingSchema = mongoose.Schema({
    project_title:{
        type:String,
        require:true
    },
    project_image:{
        type:String,
        require:true
    },
    project_content:{
        type:String,
        require:true
    },
    project_detail:{
        type:String,
        require:true
    } 
}) 



module.exports = mongoose.model('projectSetting',projectSettingSchema );