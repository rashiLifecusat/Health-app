var libConf = require("../index");
var logger = require("../config/logger");
var multer = require("../index").multer;
// var constants= require('../config/constant')
module.exports = {
  checkRes: (data) => {
    const obj = { status: true, code: 200 };
    if (Array.isArray(data)) {
      obj.data = data;
    } else {
      obj.results = data;
    }
    return obj;
  },
  // runMulter:()=>{
  // },
  customMessages: () => {
    var messages = {
      USER_EXIST: "user already exists",
      DATA_NOT_FOUND: "Data Not Found",
      CREATION: "Feed created successfully",
      ERROR: "Error",
      UPDATE: "Profile updated successfully",
      DELETE: "Feed deleted successfully",
      VERIFIED: "Your mobile number is Verified!",
      NOT_MATCHED: "Password does not match",
      USER_NOT_FOUND: "User not found",
      LOGIN: "You have successfully logged in.",
      OTP_NOT_MATCHED: "The OTP entered is incorrect.",
      VERFIED: "Your mobile number is Verified!",
      ANNONYMOUS: "Something Went Wrong, Please Try Again Later.",
      ERROR: "Error",
      SESSION_ERROR:
        "Session expired. please retry or login again to continue hooked App.",
      SESSION_ERROR_Admin:
        "Session expired. please retry or login again to continue Union news App admin panel.",
      BLOCKED_BY_ADMIN: `An administrator has blocked you from running this app. For more information please contact the “hookedApp@gmail.com” administrator.`,
      INVALID_PATH: "Invalid path access",
      OTP_SENT_EMAIL: "Otp sent on your registered email id ",
      OTP_SENT: "Otp sent on your mobile ",
      FIELD_ERR: "is Required",
      PWD_CHANGE_ERR: "Unable to change password",
      PWD_CHANGED: "Password changed successfully",
      OLD_PWD: "The old password you have entered is incorrect",
      PWD_INC: "The password you have entered is incorrect",
      PWD_ON_EMAIL: "Password sent on your registered email.",
      FETCH: "Data fetched successfully",
      EMAIL_NOT_VERIFIED:
        "A verification link has been sent to your email account. Please click on the link that has just been sent to your email account to verify your email and continue the registration process.",
      EMAIL_EXIST:
        "Already exists an account registered with this email address.",
      PHONE_EXIST:
        "Already exists an account registered with this phone number",
      PHONE_NOT_EXIST: "Account does not exist with this mobile number",
      REGISTER: "Congratulations, your account has been successfully created.",
      NEW_OTP: "NEW OTP",
      INVALID_OTP: "The OTP entered is incorrect.",
      EMAIL_NOT_EXIST: "Account does not exist with this email",
      // EMAIL_EXIST: 'Invalid Email',
      ACOOUNT_BLOCKED:
        "An administrator has blocked you from running this app. For more information please contact the “appinfo.profession@gmail.com” administrator",
      OLD_PASSWORD: "The old password you have entered is incorrect.",
      ENV: "This email is not verified We send you the verification link to your mail",
      OTP_VERIFIED:"OTP verified",
      OTP_MAIL:"Otp send to your email",
      LOGG_OUT:"Logged out successfully"
    };
    return messages;
  },
  otp: () => {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  },
  // sendNotificationNew: async function (senderId, reciverId,  data, message, title, token, badgecountINC){
  //     console.log("\n\n\n\n+++++++++++++++++++++++=NOTIFICATION",data)
  //     var key=constants.fireKey
  //     console.log(key,"eeee")
  //     var fcm = new libConf.FCM(key);

  //         var data=data;
  //         var message=message;
  //         var title=title;
  //         var token=token;

  //         var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
  //             to: token,
  //             // collapse_key: 'green',

  //             notification: {
  //                 title: "",
  //                 body: data ,
  //                 // type: type ,
  //                 badge: badgecountINC,
  //                 sender_id: senderId,
  //                 receiver_id: reciverId,
  //                 // other_id :  other_id,
  //                 // type: type,
  //                 // scheduletype:scheduletype

  //             },

  //             data: {  //you can send only notification or only data(or include both)
  //                 // title: message,
  //                 // type: type,
  //                 body: message
  //             }
  //         };
  //        // console.log(message);

  //         fcm.send(message, function(err, response){
  //             if (err) {
  //                 console.log("Something has gone wrong!", err);
  //             } else {
  //                 // console.log("Successfully sent with response: ", response);
  //                 console.log({
  //                     status: true,
  //                     code: 200,
  //                     message: 'Successfully sent with response',
  //                     data: response
  //                 })
  //             }
  //         });

  // },
};
