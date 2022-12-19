const lib = require("../../index");
var logger = require("../../config/logger");
const commonfunctions = require("../commonfunctions");
const messages = commonfunctions.customMessages();
const env = require("../../env");
const mongoose= require("mongoose");
const otpModel = require("../../Models/UserModels/OtpModel");
const e = require("express");
require("dotenv").config();
var appCred = require("../../config/appcredentials")[env.instance];
// var a=lib.jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5jeW95c2g5MzVAY291bGRtYWlsLmNvbSIsImNvbnRhY3QiOiIxMjMzNDQ0IiwiY291bnRyeUNvZGUiOiIxIiwidXNlcl9uYW1lIjoiaGV5IiwicGFzc3dvcmQiOiIxMjMzNDU1Njc4OCIsImxvbmdpdHVkZSI6IjEyLjAiLCJsYXRpdHVkZSI6IjEzLjAiLCJyb2xlIjoic3RyaW5nIiwiaWF0IjoxNjcxMzA4NTE1fQ.TgvQj-TH6B9uh0V11q11Il4WrpyDnvV9A2A4zVezkb0",process.env.JWT_SECRET)
// console.log(a,"data is here")

const getHashedPassword = (password) => {
  const sha256 = lib.crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

module.exports = {
  generateOtp: async (req, res) => {
    var body = req.body;
    console.log(body,"1111")
    try {
      const email = body.email || "";
      const verifiedEmail = await lib.userModel.find({
        $and: [{ email: email }, { isEmailVerified: true }],
      });
      if (verifiedEmail.length > 0) {
        return res.status(201).json({
          status: false,
          message: messages.EMAIL_EXIST,
          code: 201,
        });
      }
    } catch (e) {
      logger.error(e);
      return res.status(201).send(e);
    }

    try {
      var deleteManyOtp= await otpModel.deleteMany({email:body.email})
      var otpData = {
        email: body.email,
        otp: commonfunctions.otp(),
      };
      var newOtp = new lib.otpModel(otpData);
      newOtp.save();
      var token= lib.jwt.sign(body, process.env.JWT_SECRET);
      var templatePath = lib.path.join(__dirname, "../../Templates");
        const handlebarsOptions = {
          viewEngine: {
            extName: ".hbs",
            partialsDir: templatePath,
            defaultLayout: false,
          },
          viewPath: templatePath,
          extName: ".hbs",
        };
        const transporter = lib.nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "cusatproject2023@gmail.com",
            pass: "oqekxaavbjhzdjfz",
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        transporter.use("compile", lib.nodemailerHbs(handlebarsOptions));
        var user = {
          user_name: body.email,
          email:body.email ,
          // _id:user._id
        };
        var mailOptions = {
          from: "cusatproject2023@gmail.com",
          to: user.email,
          subject: "email verifiction ",
          template: "emailOtp",
          context: {
            otp: `${newOtp.otp}`,
            text1: `Hi, ${body.email} this is the mail to create new account with health-app`,
            text2:
              "Please use the otp given below",
          },
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            logger.error(JSON.stringify(error));
            // console.log(error, "err");
          } else {
            logger.info(JSON.stringify(info));
            // console.log("Email sent:" + info.response);
          }
        });
      var response = commonfunctions.checkRes(otpData);
      response.message = messages.OTP_SENT;
      response.otp = otpData.otp;
      response.returnToken=token;
      delete response.results;
      logger.info(
        `${req.url},${req.method},${req.hostname},${JSON.stringify(
          response.status
        )}`
      );
      return res.status(200).send(response);
    } catch (e) {
      logger.error(e);
      return res.status(201).send(e);
    }
  },

  resendOtp: async (req, res) => {
    var body = req.body;
    try {
      var deleteOtp = await lib.otpModel.deleteMany({
        email:body.email
      });
    } catch (e) {
      logger.error(e);
      return res.status(201).send(e);
    }

    try {
      if (deleteOtp.deletedCount > 0) {
        var otpData = {
          email:body.email,
          otp: commonfunctions.otp(),
        };

        var newOtp = new lib.otpModel(otpData);
        newOtp.save();
        var response = commonfunctions.checkRes(newOtp);
        response.message = messages.OTP_SENT;
        response.otp = otpData.otp;
        delete response.results;
        logger.info(
          `${req.url},${req.method},${req.hostname},${JSON.stringify(
            response.status
          )}`
        );
        return res.status(200).send(response);
      } else {
        return res
          .status(201)
          .send({ code: 201, message: messages.ANNONYMOUS, status: false });
      }
    } catch (e) {
      logger.error(e);
      return res
        .status(201)
        .send({ code: 201, message: messages.ANNONYMOUS, status: false });
    }
  },

  verifyOTP: async (req, res) => {
    var body = req.body;
    try {
      var otpMatch = await lib.otpModel.find({
        $and: [
          {email:body.email},
          { otp: body.otp },
        ],
      });
    } catch (e) {
      logger.error(e);
      return res.status(201).send(e);
    }
    if (otpMatch.length > 0) {
      var response = commonfunctions.checkRes(otpMatch);
      response.message = messages.OTP_VERIFIED;
      delete response.data;
      logger.info(
        `${req.url},${req.method},${req.hostname},${JSON.stringify(
          response.status
        )}`
      );
      return res.status(200).send(response);
    } else {
      return res
        .status(201)
        .send({ code: 201, status: true, message: messages.OTP_NOT_MATCHED });
    }
  },

  register: async (req, res) => {
    var body = lib.jwt.verify(req.headers["x_token"],process.env.JWT_SECRET)
    try {
      var email = await lib.userModel.aggregate([
        {
          $match: {
            email: body.email,
            isEmailVerified: true,
          },
        },
      ]);

      if (email.length > 0) {
        return res.json({
          status: false,
          code: 201,
          message: messages.EMAIL_EXIST,
        });
      }
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
    var longitude = parseFloat(body.longitude);
    var latitude = parseFloat(body.latitude);
    let data = {
      user_name: body.user_name,
      email: body.email,
      password: body.password,
      contact: body.contact,
      countryCode: body.countryCode,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      role: body.role,
      accessToken: "",
    };
    var user = new lib.userModel(data);
    try {
      var hashedPassword = getHashedPassword(user.password);
      user.password = hashedPassword;
      var accessToken = lib.jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      user.accessToken = accessToken;
      var newUser = await user.save();
      try {
        if (body.contact && body.countryCode) {
          var otpDelete = await lib.otpModel.deleteMany({
            contact: user.contact,
            countryCode: user.countryCode,
          });
        }

        var extoken = lib.jwt.sign(
          { email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1hr" }
        );
        const link = `${appCred.baseUrl}/user/emailverify/${user._id}/${extoken}`;

        var templatePath = lib.path.join(__dirname, "../../Templates");
        const handlebarsOptions = {
          viewEngine: {
            extName: ".hbs",
            partialsDir: templatePath,
            defaultLayout: false,
          },
          viewPath: templatePath,
          extName: ".hbs",
        };
        const transporter = lib.nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "cusatproject2023@gmail.com",
            pass: "oqekxaavbjhzdjfz",
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        transporter.use("compile", lib.nodemailerHbs(handlebarsOptions));
        var user = {
          user_name: body.email,
          email:user.email ,
          _id:user._id
        };
        var mailOptions = {
          from: "cusatproject2023@gmail.com",
          to: user.email,
          subject: "email verifiction ",
          template: "emailverification",
          context: {
            link: `${link}`,
            text1: `Hi, ${user.user_name} You have successfully created an account on Health App with ${user.email}`,
            text2:
              "Please click on the link below Or copy paste this link in to your browser to verify your email",
          },
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            logger.error(JSON.stringify(error));
            // console.log(error, "err");
          } else {
            logger.info(JSON.stringify(info));
            // console.log("Email sent:" + info.response);
          }
        });
        var userDetails= await lib.userModel.findOne({_id:user._id},{password:0})
        var response= commonfunctions.checkRes(userDetails)
        response.message=messages.REGISTER
        logger.info(
          `${req.url},${req.method},${req.hostname},${JSON.stringify(
            response.status
          )}`
        );
        return res.status(200).send(response)
      } catch (e) {}
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  },
  emailVerified: async (req, res) => {
    var userId = req.params.id;
    var token = req.params.token;
    let key = process.env.JWT_SECRET;
    if (token) {
      const decode = lib.jwt.verify(token, key, async (err, data) => {
        if (err) {
          res.render("linkexpired");
        } else {
       
          try {
            var dw = await lib.userModel.aggregate([
              {
                $match: {
                  _id: mongoose.Types.ObjectId(userId),
                  isEmailVerified: true,
                },
              },
            ]);
          } catch (e) {
            logger.error(e);
            return res.status(201).send(e);
          }
          try {
            if (dw.length > 0) {
              res.render("linkexpired");
            } else {
              var b = await lib.userModel.findOneAndUpdate(
                { _id: userId },
                { isEmailVerified: true }
              );
              res.render("verified");
            }
          } catch (e) {
            logger.error(e);
            return res.status(201).send(e);
          }
        }
      });
    } else {
      res.render("404");
    }
  },
  login:async(req,res)=>{
    var body= req.body;
    var checkEmail = body.email==undefined  || body.email==""  ? false:true
    var checkMobile = body.contact==undefined  || body.contact==""  ? false:true
    var checkMobileCode = body.countryCode==undefined  || body.countryCode==""  ? false:true
    var object = {}
    if(checkEmail==false && checkMobile==false && checkMobileCode==false){
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }else
    if (checkEmail==false){
      object.contact = body.contact
      object.countryCode = body.countryCode
    } else if (checkMobile==false &&  checkMobileCode==false){
      object.email = body.email;
    }else{
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }

    const condition = object.email
    ? { email: object.email }
    : { contact: object.contact, countryCode: object.countryCode };

    try {
      var user = await lib.userModel.findOne(condition)
      if (!user) {
        return res.json({
          status: false,
          code: 201,
          message: messages.USER_NOT_FOUND,
        });
      }
      if (user.isEmailVerified == false && checkEmail==true) {
        var extoken = lib.jwt.sign(
          { email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1hr" }
        );
        const link = `${appCred.baseUrl}/user/emailverify/${user._id}/${extoken}`;

        var templatePath = lib.path.join(__dirname, "../../Templates");
        const handlebarsOptions = {
          viewEngine: {
            extName: ".hbs",
            partialsDir: templatePath,
            defaultLayout: false,
          },
          viewPath: templatePath,
          extName: ".hbs",
        };
        const transporter = lib.nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "cusatproject2023@gmail.com",
            pass: "oqekxaavbjhzdjfz",
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        transporter.use("compile", lib.nodemailerHbs(handlebarsOptions));
        var user = {
          user_name: body.email,
          email:user.email ,
          _id:user._id
        };
        var mailOptions = {
          from: "cusatproject2023@gmail.com",
          to: user.email,
          subject: "email verifiction ",
          template: "emailverification",
          context: {
            link: `${link}`,
            text1: `Hi, ${user.user_name} You have successfully created an account on Health App with ${user.email}`,
            text2:
              "Please click on the link below Or copy paste this link in to your browser to verify your email",
          },
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            logger.error(JSON.stringify(error));
            // console.log(error, "err");
          } else {
            logger.info(JSON.stringify(info));
            // console.log("Email sent:" + info.response);
          }
        });
        return res.json({
          status: false,
          code: 202,
          message: messages.ENV
        });
      }
    } catch (e) {
      logger.error(e)
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }

    try {
      if(user && checkEmail==true){     
        var hashedPassword= getHashedPassword(body.password)
        if(hashedPassword==user.password){
         
          var Token = lib.jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET
          );
          var updateUser = await lib.userModel.updateMany({_id:user._id},
          {
            accessToken:Token,
            isOnline:true
          })
          var updatedUser = await lib.userModel.findOne({_id:user._id},{password:0})
          var response = commonfunctions.checkRes(updatedUser);
          response.message=messages.LOGIN
          logger.info(
            `${req.url},${req.method},${req.hostname},${JSON.stringify(
              response.status
            )}`
          );
          return res.status(200).send(response);
        }else{
          return res.json({
            status: false,
            code: 201,
            message: messages.PWD_INC,
          });
        }
      }else{
          return res.json({
            status: false,
            code: 201,
            message: messages.ANNONYMOUS,
          });
        }
      // else if(user && checkMobile==true && checkMobileCode ==true){
      //   var findOtpdata= await lib.otpModel.find({
      //     "$and":[
      //       {"countryCode":user.countryCode},
      //       {"contact":user.contact}
      //     ]
      //   })
      //   if(findOtpdata.length>0){
      //     var deleteAll= await lib.otpModel.deleteMany({
      //       "$and":[
      //         {contact:user.contact},
      //         {countryCode:user.countryCode}
      //       ]
      //     })
      //   }
      //   var newOtpdata= {
      //     contact:user.contact,
      //     countryCode:user.countryCode,
      //     otp:commonfunctions.otp()
      //   }
      //   var newOtp = new lib.otpModel(newOtpdata);
      //   newOtp.save();
      //   var Token = lib.jwt.sign(
      //     { _id: user._id },
      //     process.env.JWT_SECRET
      //   );
      //   var updateUser = await lib.userModel.updateMany({_id:user._id},
      //   {
      //     accessToken:Token,
      //     isOnline:true
      //   })
      //   var updatedUser = await lib.userModel.findOne({_id:user._id},{password:0})
      //   var response = commonfunctions.checkRes(updatedUser);
      //     response.message=messages.OTP_SENT
      //     response.otp=newOtp.otp
      //     logger.info(
      //       `${req.url},${req.method},${req.hostname},${JSON.stringify(
      //         response.status
      //       )}`
      //     );
      //     return res.status(200).send(response);
      // }else{
      //   return res.json({
      //     status: false,
      //     code: 201,
      //     message: messages.ANNONYMOUS,
      //   });
      // }
    } catch (e) {
      logger.error(e)
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  },
  forgotPassword:async(req,res)=>{
    var body= req.body
    try {
      var user= await lib.userModel.findOne({ email: body.email })
      if(!user){
        return res.json({
          status: false,
          code: 201,
          message: messages.USER_NOT_FOUND,
        });
      }
      if(user.isEmailVerified==false){
        return res.json({
          status: false,
          code: 201,
          message: messages.ENV,
        });
      }
    } catch (e) {
      logger.error(e)
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }

    try {
      if(user){
        var findAndDeleteMany= await lib.otpModel.deleteMany({email:user.email})
        var otpData = {
          email: user.email,
          otp: commonfunctions.otp(),
        };
        var newOtp = new lib.otpModel(otpData);
        newOtp.save();
        var templatePath = lib.path.join(__dirname, "../../Templates");
        const handlebarsOptions = {
          viewEngine: {
            extName: ".hbs",
            partialsDir: templatePath,
            defaultLayout: false,
          },
          viewPath: templatePath,
          extName: ".hbs",
        };
        const transporter = lib.nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "infoemailscheck@gmail.com",
            pass: "umknzzuboyobshme",
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        transporter.use("compile", lib.nodemailerHbs(handlebarsOptions));
        var user = {
          user_name: user.user_name,
          email:user.email ,
          _id:user._id
        };
        var mailOptions = {
          from: "Infoemailscheck@gmail.com",
          to: user.email,
          subject: "email verifiction ",
          template: "emailOtp",
          context: {
            otp: `${newOtp.otp}`,
            text1: `Hi, ${user.user_name} this is the mail to setup new password for your account associated with tapplist app `,
            text2:
              "Please use the otp given below",
          },
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            logger.error(JSON.stringify(error));
            // console.log(error, "err");
          } else {
            logger.info(JSON.stringify(info));
            // console.log("Email sent:" + info.response);
          }
        });

        var response= commonfunctions.checkRes(newOtp);
        response.message=messages.OTP_MAIL
        response.otp=newOtp.otp
        delete response.results
        logger.info(
          `${req.url},${req.method},${req.hostname},${JSON.stringify(
            response.status
          )}`
        );
        return res.status(200).send(response);
      }
    } catch (e) {
      logger.error(e)
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  },
  verifyEmailOtp:async(req,res)=>{
    var body= req.body;
    try {
      var verifyOtp= await lib.otpModel.find({
        "$and":[
          {email:body.email},
          {otp:body.otp}
        ]
      })
      if(verifyOtp.length>0){
        var response = commonfunctions.checkRes(verifyOtp);
        response.message= messages.OTP_VERIFIED
        delete response.data
        logger.info(
          `${req.url},${req.method},${req.hostname},${JSON.stringify(
            response.status
          )}`
        );
        return res.status(200).send(response);
      }else{
        return res.json({
          status: false,
          code: 201,
          message: messages.INVALID_OTP,
        });
      }
    } catch (e) {
      logger.error(e)
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  },
  newPassword:async(req,res)=>{
    var body= req.body
    try {
      var user =await lib.userModel.findOne({email:body.email})
      if(user && body.password){
        var hashedPassword=getHashedPassword(body.password);
        var updateUser= await lib.userModel.findByIdAndUpdate({_id:user._id},{password:hashedPassword})
        var response= commonfunctions.checkRes(updateUser);
        response.message= messages.PWD_CHANGED;
        delete response.results
        logger.info(
          `${req.url},${req.method},${req.hostname},${JSON.stringify(
            response.status
          )}`
        );
        return res.status(200).send(response);
      }
    } catch (e) {
      logger.error(e)
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  },
  resetPassword:async(req,res)=>{
    var body= req.body
    try {
      var user = await lib.userModel.findOne({accessToken:req.headers["x_tokken"]})
    } catch (e) {
      logger.error(e)
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }

    try {
      var oldPassword= getHashedPassword(body.old_password);
      if(oldPassword==user.password){
          var newPassword = getHashedPassword(body.new_password);
          var userUpdate= await lib.userModel.findOneAndUpdate({_id:user._id},{password:newPassword});
          var response=commonfunctions.checkRes(userUpdate);
          response.message=messages.PWD_CHANGED
          delete response.results
          logger.info(
            `${req.url},${req.method},${req.hostname},${JSON.stringify(
              response.status
            )}`
          );
          return res.status(200).send(response);
      }else{
        return res.json({
          status: false,
          code: 201,
          message: messages.OLD_PASSWORD,
        });
      }
    } catch (e) {
      logger.error(e)
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  },
  logOut:async(req,res)=>{
    try {
      var user= await lib.userModel.findOne({accessToken:req.headers["x_tokken"]})
      var updateUser = await lib.userModel.findByIdAndUpdate({_id:user._id},{
        accessToken:"",
        device_Token:  "" ,
        device_type:"",
        app_version: "",
        device_model: "",
        isOnline:false
      })
      var response= commonfunctions.checkRes(user);
      response.message=messages.LOGG_OUT;
      delete response.results
      logger.info(
        `${req.url},${req.method},${req.hostname},${JSON.stringify(
          response.status
        )}`
      );
      return res.status(200).send(response);
    } catch (e) {
      logger.error(e)
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  },
  updateProfile:async(req,res)=>{
    var body=req.body
    try {
      var user = await lib.userModel.findOne({accessToken:req.headers["x-token"]})    
    } catch (e) {
      logger.error(e)
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }

    try {
      if(user){
    
        var data = {
          user_name:body.user_name=="" ? user.user_name:body.user_name,
          contact:body.contact =="" ? user.contact:body.contact,
          profilePhoto: body.file=="" ? user.profilePhoto: body.file,
          bio:body.bio=="" ? user.bio:body.bio,
          category:body.category=="" ? user.category : body.category,
          email:body.email=="" ? user.email:body.email
        }
  
        var updatedUserdata = await lib.userModel.findByIdAndUpdate({_id:user._id},data,{new:true});
        delete updatedUserdata.password;
        var response= commonfunctions.checkRes(updatedUserdata);
        response.message=messages.UPDATE;
        delete response.results.password
        logger.info(
          `${req.url},${req.method},${req.hostname},${JSON.stringify(
            response.status
          )}`
        );
        return res.status(200).send(response);
  
      }
    } catch (e) {
      logger.error(e)
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
    
    
  },

  booking_request:async(req,res)=>{
    var body= req.body;
    try {
      var user= await lib.userModel.findOne({accessToken:req.headers["x-token"]})
    } catch (e) {
      logger.error(e)
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }

    try {
      var data ={
        userId:user._id,
        date:body.date,
        doctorId:body.doctorId
      }
      var request_send= new lib.bookingModel(data)
      request_send.save()
      var response= commonfunctions.checkRes(request_send);
      response.message="Request send successfully";
      logger.info(
        `${req.url},${req.method},${req.hostname},${JSON.stringify(
          response.status
        )}`
      );
      return res.status(200).send(response);
      
    } catch (e) {
      logger.error(e)
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      })
    }
  },

  accept_or_decline:async(req,res)=>{
    var body= req.body;
    try {
      var user= await lib.userModel.findOne({accessToken:req.headers["x-token"]})
    } catch (e) {
      logger.error(e)
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
    var checkForRequest= await lib.bookingModel.find({$and:[{_id:body.requestId},{doctorId:user._id}]})
    if(checkForRequest.length>0 && checkForRequest[0].type=="0" && (body.type=="1" || body.type =="2")){
        var updateRequest= await lib.bookingModel.findOneAndUpdate({_id:body.requestId},{type:body.type})
        var response= commonfunctions.checkRes(updateRequest);
        response.message=body.type=="1" ? "Request accepted":"Cancelled the request"
        logger.info(
          `${req.url},${req.method},${req.hostname},${JSON.stringify(
            response.status
          )}`
        );
        return res.status(200).send(response);
    }else{
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  }
};
