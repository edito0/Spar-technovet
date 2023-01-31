const mongoose = require('mongoose');

const analayticsSettingSchema = mongoose.Schema({
    address:{
        type:String,
        require:true
    },
    linkedin:{
        type:String,
        require:true
    },
    instagram:{
        type:String,
        require:true
    },
    pinterest:{
        type:String,
        require:true
    },
}) 

module.exports = mongoose.model('analyticsSetting',analayticsSettingSchema);