const mongoose = require('mongoose');

const projectSettingSchema = mongoose.Schema({
    project_title:{
        type:String,
        require:true
    },
    project_image:{
        type: Object,
        require:true
    },
    project_content:{
        type:String,
        require:true
    },
    scope:{
        type:String,
        require:true
    }, 
    location:{
        type:String,
        require:true
    }, 
    photographer:{
        type:String,
        require:true
    },  
    featuredin:{
        type:String,
        require:true
    }  
}) 



module.exports = mongoose.model('projectSetting',projectSettingSchema );