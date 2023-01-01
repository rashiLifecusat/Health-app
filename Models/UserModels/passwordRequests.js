var mongoose= require("mongoose")

const schema=mongoose.Schema;

const passwordRequestSchema=new schema({
    userId:{type:schema.Types.ObjectId,refer:"users"},
    status:{type:Boolean,default:false}
})

const passwordRequestModel=mongoose.model('password_requests',passwordRequestSchema);

module.exports=passwordRequestModel;