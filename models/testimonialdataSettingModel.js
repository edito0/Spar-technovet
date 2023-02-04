const mongoose = require('mongoose');

const testimonialdataSettingSchema = mongoose.Schema({
    testimonial_name:{
        type:String,
        require:true
    },
    testimonial_position:{
        type:String,
        require:true
    },
    testimonial_image:{
        type:String,
        require:true
    },
    
    testimonial_message:{
        type:String,
        require:true
    }  
}) 



module.exports = mongoose.model('testimonialSetting',testimonialdataSettingSchema);