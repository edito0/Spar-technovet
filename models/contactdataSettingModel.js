const mongoose = require('mongoose');

const contactSettingSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String
    },
    phone:{
        type:Number,
        require:true
    },
    inquiryType:{
        type:String,
        require:true
    },
    
    message:{
        type:String
    },
    


}) 



module.exports = mongoose.model('contactSetting',contactSettingSchema );