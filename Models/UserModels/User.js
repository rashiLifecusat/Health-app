var mongoose = require("mongoose");
const pointSchema = mongoose.Schema({
  type: {
    type: String,
    enum: [
      "Point",
      "Multipoint",
      "Linestring",
      "MultiLineString",
      "Polygon",
      "MultiPolygon",
    ],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

var userSchema = mongoose.Schema({
  email: { type: String },
  contact: { type: String, default: "" },
  countryCode: { type: String, default: "" },
  user_name: { type: String, default: "" },
  password: { type: String, default: "" },
  device_Token: { type: String, default: "" },
  device_type: { type: String, default: "" },
  app_version: { type: String, default: "" },
  device_model: { type: String, default: "" },
  role: { type: String, default: "" },
  isEmailVerified:{type:Boolean,default:false},
  location: pointSchema,
  accessToken:{type:String,default:""},
  isOnline:{type:Boolean,default:true},
  category:{type:mongoose.Types.ObjectId,refer:"categorys"},
  profilePhoto:{type:String,default:""},
  bio:{type:String,default:""}
});
userSchema.index({ location: "2dsphere" });
var userModel = mongoose.model("user", userSchema);
module.exports = userModel;
