const mongoose = require('mongoose')

const BlogSchema = new mongoose.Schema({
    title:{
        type: String,
        default:''
    },
    image:{
        type: String,
        default:'',
    },
    article:{
        type: String,
        default:''
    }
})

module.exports = mongoose.model('Blog', BlogSchema);