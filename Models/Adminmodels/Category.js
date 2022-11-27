var mongoose= require('mongoose');

var categorySchema= mongoose.Schema({
    category:{type:String},
    image:{type:String}
})


var categoryModel= mongoose.model('category',categorySchema)
module.exports=categoryModel;
