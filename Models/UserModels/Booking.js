var mongoose= require('mongoose');

var bookingSchema= mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId,refer:"users"},
    date:{type:String},
    doctorId:{type:mongoose.Types.ObjectId,refer:"users"},
    consultingDuration:{type:String,default:"1 hour"},
    type:{type:String,default:"0"}
})


var bookingModel= mongoose.model('booking',bookingSchema)
module.exports=bookingModel;
