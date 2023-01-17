const mongoose = require('mongoose');

const homedataSettingSchema = mongoose.Schema({
    home_image:{
        type:String,
        require:true,
        default:""
    }   
})  



module.exports = mongoose.model('homeSetting',homedataSettingSchema);