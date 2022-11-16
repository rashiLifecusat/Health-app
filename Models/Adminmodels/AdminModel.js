var mongoose= require('mongoose')

var adminSchema= mongoose.Schema({
    email:{type:String,default:""},
    name:{type:String,default:""},
    password:{type:String,default:""},
    accessToken:{type:String,default:""}
})

var adminModel= mongoose.model('admin',adminSchema)
module.exports=adminModel;