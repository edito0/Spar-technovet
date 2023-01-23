const mongoose = require('mongoose');

const mediadataSettingSchema = mongoose.Schema({
    instagram_link:{
        type:String,
        require:true
    },
    pintrest_link:{
        type:String,
        require:true
    }
}) 



module.exports = mongoose.model('mediaSetting',mediadataSettingSchema);