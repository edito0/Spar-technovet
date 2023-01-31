const mongoose = require('mongoose');

const mediadataarticleSettingSchema = mongoose.Schema({

    featured_link:{
        type:String,
        require:true
    },
    featured_title:{
        type:String,
        require:true
    },
    featured_image:{
        type:String,
        require:true
    }
}) 



module.exports = mongoose.model('mediaArticleSetting',mediadataarticleSettingSchema);