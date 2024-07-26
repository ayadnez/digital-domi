const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
    title : {
        type : String,
        
    },
    url : {
        type : String
    }
});

const Image = mongoose.model('Image',UserSchema);
module.exports = Image;