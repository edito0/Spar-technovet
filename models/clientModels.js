const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    client_email:{
        type:String,
        require:true
    },
    client_password:{
        type:String,
        require:true
    }
})  

module.exports = mongoose.model('clientsetting',clientSchema);