let mongoose  = require('mongoose');
let dbConnect = require('./dbConnect');
dbConnect();  //for creating connection between mongoose and node.js

let Schema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        required:true,
        uniqueCaseInsensitive: true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        
    },
    address:{
        type:String,
        required:true
    }
});

module.exports = Schema;