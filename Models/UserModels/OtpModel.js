var mongoose= require('mongoose')

var otpSchema= mongoose.Schema({
    email:{type:String,default:""},
    otp:{type:String,require:true}
})

var otpModel= mongoose.model('otp',otpSchema)
module.exports=otpModel;
