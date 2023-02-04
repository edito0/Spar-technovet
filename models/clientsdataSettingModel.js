const mongoose = require('mongoose');

const clientsdataSettingSchema = mongoose.Schema({
    client_logo:{
        type:String,
        require:true
    }
}) 



module.exports = mongoose.model('clientsSetting',clientsdataSettingSchema);