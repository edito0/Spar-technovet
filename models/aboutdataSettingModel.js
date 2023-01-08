const mongoose = require('mongoose');

const aboutdataSettingSchema = mongoose.Schema({
    about_title:{
        type:String,
        require:true
    },
    about_image:{
        type:String,
        require:true
    },
    
    about_content:{
        type:String,
        require:true
    }  
}) 



module.exports = mongoose.model('aboutSetting',aboutdataSettingSchema);