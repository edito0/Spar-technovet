const mongoose = require('mongoose');

const servicesSettingSchema = mongoose.Schema({
    services_title:{
        type:String,
        require:true
    },
    services_image:{
        type:String,
        require:true
    },
    
    services_content:{
        type:String,
        require:true
    }    
}) 



module.exports = mongoose.model('servicesSetting',servicesSettingSchema );