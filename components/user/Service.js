const lib = require("../../index");
var logger = require("../../config/logger");
const commonfunctions = require("../commonfunctions");
const messages = commonfunctions.customMessages();
const env = require("../../env");
const mongoose = require("mongoose");
const otpModel = require("../../Models/UserModels/OtpModel");
const e = require("express");
const FavModel = require("../../Models/UserModels/Favourites");
const passwordRequestModel = require("../../Models/UserModels/passwordRequests");
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
    console.log(body, "1111");
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
      var deleteManyOtp = await otpModel.deleteMany({ email: body.email });
      var otpData = {
        email: body.email,
        otp: commonfunctions.otp(),
      };
      var newOtp = new lib.otpModel(otpData);
      newOtp.save();
      var token = lib.jwt.sign(body, process.env.JWT_SECRET);
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
        email: body.email,
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
          text2: "Please use the otp given below",
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
      response.returnToken = token;
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
        email: body.email,
      });
    } catch (e) {
      logger.error(e);
      return res.status(201).send(e);
    }

    try {
      if (deleteOtp.deletedCount > 0) {
        var otpData = {
          email: body.email,
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
        $and: [{ email: body.email }, { otp: body.otp }],
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
    var body = lib.jwt.verify(req.headers["x_token"], process.env.JWT_SECRET);
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
    console.log(body.role, "jjjjjj");
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
          email: user.email,
          _id: user._id,
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
        var userDetails = await lib.userModel.findOne(
          { _id: user._id },
          { password: 0 }
        );
        var response = commonfunctions.checkRes(userDetails);
        response.message = messages.REGISTER;
        logger.info(
          `${req.url},${req.method},${req.hostname},${JSON.stringify(
            response.status
          )}`
        );
        return res.status(200).send(response);
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
  login: async (req, res) => {
    var body = req.body;
    var checkEmail = body.email == undefined || body.email == "" ? false : true;
    var checkMobile =
      body.contact == undefined || body.contact == "" ? false : true;
    var checkMobileCode =
      body.countryCode == undefined || body.countryCode == "" ? false : true;
    var object = {};
    if (
      checkEmail == false &&
      checkMobile == false &&
      checkMobileCode == false
    ) {
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    } else if (checkEmail == false) {
      object.contact = body.contact;
      object.countryCode = body.countryCode;
    } else if (checkMobile == false && checkMobileCode == false) {
      object.email = body.email;
    } else {
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
      var user = await lib.userModel.findOne(condition);
      if (!user) {
        return res.json({
          status: false,
          code: 201,
          message: messages.USER_NOT_FOUND,
        });
      }
      if (user.isEmailVerified == false && checkEmail == true) {
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
          email: user.email,
          _id: user._id,
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
          message: messages.ENV,
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

    try {
      if (user && checkEmail == true) {
        var hashedPassword = getHashedPassword(body.password);
        if (hashedPassword == user.password) {
          var Token = lib.jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
          var updateUser = await lib.userModel.updateMany(
            { _id: user._id },
            {
              accessToken: Token,
              isOnline: true,
            }
          );
          var updatedUser = await lib.userModel.findOne(
            { _id: user._id },
            { password: 0 }
          );
          var response = commonfunctions.checkRes(updatedUser);
          response.message = messages.LOGIN;
          logger.info(
            `${req.url},${req.method},${req.hostname},${JSON.stringify(
              response.status
            )}`
          );
          return res.status(200).send(response);
        } else {
          return res.json({
            status: false,
            code: 201,
            message: messages.PWD_INC,
          });
        }
      } else {
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
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  },
  // forgotPassword: async (req, res) => {
  //   var body = req.body;
  //   try {
  //     var user = await lib.userModel.findOne({ email: body.email });
  //     if (!user) {
  //       return res.json({
  //         status: false,
  //         code: 201,
  //         message: messages.USER_NOT_FOUND,
  //       });
  //     }
  //     if (user.isEmailVerified == false) {
  //       return res.json({
  //         status: false,
  //         code: 201,
  //         message: messages.ENV,
  //       });
  //     }
  //   } catch (e) {
  //     logger.error(e);
  //     return res.json({
  //       status: false,
  //       code: 201,
  //       message: messages.ANNONYMOUS,
  //     });
  //   }

  //   try {
  //     if (user) {
  //       var findAndDeleteMany = await lib.otpModel.deleteMany({
  //         email: user.email,
  //       });
  //       var otpData = {
  //         email: user.email,
  //         otp: commonfunctions.otp(),
  //       };
  //       var newOtp = new lib.otpModel(otpData);
  //       newOtp.save();
  //       var templatePath = lib.path.join(__dirname, "../../Templates");
  //       const handlebarsOptions = {
  //         viewEngine: {
  //           extName: ".hbs",
  //           partialsDir: templatePath,
  //           defaultLayout: false,
  //         },
  //         viewPath: templatePath,
  //         extName: ".hbs",
  //       };
  //       const transporter = lib.nodemailer.createTransport({
  //         service: "gmail",
  //         auth: {
  //           user: "infoemailscheck@gmail.com",
  //           pass: "umknzzuboyobshme",
  //         },
  //         tls: {
  //           rejectUnauthorized: false,
  //         },
  //       });

  //       transporter.use("compile", lib.nodemailerHbs(handlebarsOptions));
  //       var user = {
  //         user_name: user.user_name,
  //         email: user.email,
  //         _id: user._id,
  //       };
  //       var mailOptions = {
  //         from: "Infoemailscheck@gmail.com",
  //         to: user.email,
  //         subject: "email verifiction ",
  //         template: "emailOtp",
  //         context: {
  //           otp: `${newOtp.otp}`,
  //           text1: `Hi, ${user.user_name} this is the mail to setup new password for your account associated with tapplist app `,
  //           text2: "Please use the otp given below",
  //         },
  //       };
  //       transporter.sendMail(mailOptions, function (error, info) {
  //         if (error) {
  //           logger.error(JSON.stringify(error));
  //           // console.log(error, "err");
  //         } else {
  //           logger.info(JSON.stringify(info));
  //           // console.log("Email sent:" + info.response);
  //         }
  //       });

  //       var response = commonfunctions.checkRes(newOtp);
  //       response.message = messages.OTP_MAIL;
  //       response.otp = newOtp.otp;
  //       delete response.results;
  //       logger.info(
  //         `${req.url},${req.method},${req.hostname},${JSON.stringify(
  //           response.status
  //         )}`
  //       );
  //       return res.status(200).send(response);
  //     }
  //   } catch (e) {
  //     logger.error(e);
  //     return res.json({
  //       status: false,
  //       code: 201,
  //       message: messages.ANNONYMOUS,
  //     });
  //   }
  // },
  forgottPassword: async (req, res) => {
    var body = req.body;
    var password = "12345678";

    try {
      var user = await lib.userModel.findOne({ email: body.email });
      if (!user) {
        var message = "This email is not registered";
        return res
          .status(201)
          .send({ status: false, code: 201, message: message });
      } else {
        // res.send(user)
        try {
          // lib.bcrypt.genSalt(10, (err, salt) => {
          //   lib.bcrypt.hash(password, salt, async (err, hash) => {
          //     if (err) {
          //       logger.error(err);
          //     }
          var extoken = lib.jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1hr" }
          );
          // res.send(extoken)
          var requestExist = await passwordRequestModel.findOneAndDelete({
            userId: user._id,
          });

          const link = `${appCred.baseUrl}/user/changePasswordview?userId=${user._id}&token=${extoken}`;
          // res.send(link)
          //   // password = hash;
          var newRequest = new passwordRequestModel({ userId: user._id });
          newRequest.save();
          var subject = "Recover Password";
          var message = `<!DOCTYPE html>
              <html>
              <head>
              <style>
              a:link, a:visited {
                background-color: #f44336;
                color: white;
                padding: 15px 25px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
              }

              a:hover, a:active {
                background-color: red;
              }
              </style>
              </head>
              <body>
              <p>Hi, <br>You have just sent a request to recover the password associated with your account (${user.email}) in Union News  App. Please Click on the button to changeyour password  or link. the provided link will expired after 1 hour<br>
              Thanks,<br>Team Union news</p><br>
              <p>${link}</p>
              <br/>
              <div id = "parknb">
              <a style="display: block;
              width: 115px;
              height: 25px;
              background: #00A1FF;
              padding: 10px;
              text-align: center;
              border-radius: 5px;
              color: white;
              font-weight: bold;
              line-height: 25px;" href=${link} title="Verify you mail" target="_blank">Change Password</a><br>
              <div/>
              </body>
              </html>`;

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
          const mailOptions = {
            from: "cusatproject2023@gmail.com",
            to: body.email,
            subject: subject,
            html: message,
          };

          //   // var forgotPassword = await userModel.findOneAndUpdate(
          //   //   { email: email.email },
          //   //   { password: password }
          //   // );
          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              logger.error(JSON.stringify(error));
              console.log(error, "err");
            } else {
              logger.info(JSON.stringify(info));
              console.log("Email sent:" + info.response);
            }
          });
          //   // let response = commonfunction.checkRes({
          //   //   email: forgotPassword.email,
          //   //   // password: password,
          //   // });
          //   // response.message = "Password send to your registered email";
          //   logger.info(
          //     `url:${req.url},method:${req.method},host:${
          //       req.hostname
          //     },status:${JSON.stringify(true)}`
          //   );
          return res.status(200).send({
            status: true,
            code: 200,
            message: "Change password link send to your registered email",
          });
        } catch (e) {
          logger.error(e);
          res
            .status(201)
            .send({ status: false, code: 201, message: message.ANNONYMOUS });
        }
      }
    } catch (e) {
      logger.error(e);
      res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },
  getChangePasswordView: async (req, res) => {
    var userId = req.query.userId;
    var token = req.query.token;
    let key = process.env.JWT_SECRET;
    console.log("here we are1",userId)
    try {
      const decode = lib.jwt.verify(token, key, async (err, data) => {
        console.log("here we are2")
        if (err) {
          res.render("linkexpired");
        } else {
          console.log("here we are3")
          try {
            var dw = await passwordRequestModel.aggregate([
              {
                $match: {
                  userId: mongoose.Types.ObjectId(userId),
                  status: true,
                },
              },
            ]);
            console.log("here we are4",dw)
          } catch (e) {
            logger.error(e);
            return res.status(201).send(e);
          }
          try {
            if (dw.length > 0) {
              res.render("linkexpired");
            } else {
              console.log("here we are5",)
              res.render("changePassword", { id: userId });
            }
          } catch (e) {
            logger.error(e);
            return res.status(201).send(e);
          }
        }
      });
    } catch (e) {
      logger.error(e, { message: "user fetching" });
      return res
        .status(201)
        .send({ status: false, code: 201, message: message.ANNONYMOUS });
    }
  },

  submitNewPassword: async (req, res) => {
    try {
      var body = req.body;
      var password = body.password;
      var confirmPassword = body.password1;
      var userId = body.id;
      if (
        password.length < 8 ||
        confirmPassword.length < 8 ||
        password.length > 20 ||
        confirmPassword.length > 20
      ) {
        res.render("changePassword", {
          message: "Minimum 8 letters needed maximum 20",
          hasError: 1 > 0,
          id: userId,
        });
      } else {
        if (password == confirmPassword) {
          var hashedPassword = getHashedPassword(body.password);
          var updateRequest = await passwordRequestModel.findOneAndUpdate(
            { userId: userId },
            { status: true }
          );
          var userUpdate = await lib.userModel.findOneAndUpdate(
            { _id: userId },
            { password: hashedPassword }
          );
              return res.render("Success")
        } else {
          res.render("changePassword", {
            message: "password doesn't match",
            hasError: 1 > 0,
            id: userId,
          });
        }
      }
    } catch (e) {
      logger.error(e, { message: "user fetching" });
      return res
        .status(201)
        .send({ status: false, code: 201, message: "Something went wrong" });
    }
  },
  verifyEmailOtp: async (req, res) => {
    var body = req.body;
    try {
      var verifyOtp = await lib.otpModel.find({
        $and: [{ email: body.email }, { otp: body.otp }],
      });
      if (verifyOtp.length > 0) {
        var response = commonfunctions.checkRes(verifyOtp);
        response.message = messages.OTP_VERIFIED;
        delete response.data;
        logger.info(
          `${req.url},${req.method},${req.hostname},${JSON.stringify(
            response.status
          )}`
        );
        return res.status(200).send(response);
      } else {
        return res.json({
          status: false,
          code: 201,
          message: messages.INVALID_OTP,
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
  },
  newPassword: async (req, res) => {
    var body = req.body;
    try {
      var user = await lib.userModel.findOne({ email: body.email });
      if (user && body.password) {
        var hashedPassword = getHashedPassword(body.password);
        var updateUser = await lib.userModel.findByIdAndUpdate(
          { _id: user._id },
          { password: hashedPassword }
        );
        var response = commonfunctions.checkRes(updateUser);
        response.message = messages.PWD_CHANGED;
        delete response.results;
        logger.info(
          `${req.url},${req.method},${req.hostname},${JSON.stringify(
            response.status
          )}`
        );
        return res.status(200).send(response);
      }
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  },
  resetPassword: async (req, res) => {
    var body = req.body;
    try {
      var user = await lib.userModel.findOne({
        accessToken: req.headers["x_tokken"],
      });
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }

    try {
      var oldPassword = getHashedPassword(body.old_password);
      if (oldPassword == user.password) {
        var newPassword = getHashedPassword(body.new_password);
        var userUpdate = await lib.userModel.findOneAndUpdate(
          { _id: user._id },
          { password: newPassword }
        );
        var response = commonfunctions.checkRes(userUpdate);
        response.message = messages.PWD_CHANGED;
        delete response.results;
        logger.info(
          `${req.url},${req.method},${req.hostname},${JSON.stringify(
            response.status
          )}`
        );
        return res.status(200).send(response);
      } else {
        return res.json({
          status: false,
          code: 201,
          message: messages.OLD_PASSWORD,
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
  },
  logOut: async (req, res) => {
    try {
      var user = await lib.userModel.findOne({
        accessToken: req.headers["x-token"],
      });
      console.log(req.headers["x-token"], "llllll");
      var updateUser = await lib.userModel.findByIdAndUpdate(
        { _id: user._id },
        {
          accessToken: "",
          device_Token: "",
          device_type: "",
          app_version: "",
          device_model: "",
          isOnline: false,
        }
      );
      var response = commonfunctions.checkRes(user);
      response.message = messages.LOGG_OUT;
      delete response.results;
      logger.info(
        `${req.url},${req.method},${req.hostname},${JSON.stringify(
          response.status
        )}`
      );
      return res.status(200).send(response);
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  },
  updateProfile: async (req, res) => {
    var body = req.body;
    try {
      var user = await lib.userModel.findOne({
        accessToken: req.headers["x-token"],
      });
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }

    try {
      if (user) {
        var data = {
          user_name: body.user_name == "" ? user.user_name : body.user_name,
          contact: body.contact == "" ? user.contact : body.contact,
          countryCode:
            body.countrycode == "" ? user.countryCode : body.countrycode,
          profilePhoto: body.file == "" ? user.profilePhoto : body.file,
          bio: body.bio == "" ? user.bio : body.bio,
        };

        console.log(user, "kkkk", data);

        var updatedUserdata = await lib.userModel.findByIdAndUpdate(
          { _id: user._id },
          data,
          { new: true }
        );
        delete updatedUserdata.password;
        var response = commonfunctions.checkRes(updatedUserdata);
        response.message = messages.UPDATE;
        delete response.results.password;
        logger.info(
          `${req.url},${req.method},${req.hostname},${JSON.stringify(
            response.status
          )}`
        );
        return res.status(200).send(response);
      }
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  },

  getUser: async (req, res) => {
    try {
      var user = await lib.userModel.findOne(
        { accessToken: req.headers["x-token"] },
        { password: 0 }
      );
      var response = commonfunctions.checkRes(user);
      response.message = "Profile management";
      // delete response.results.password
      logger.info(
        `${req.url},${req.method},${req.hostname},${JSON.stringify(
          response.status
        )}`
      );
      return res.status(200).send(response);
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  },

  booking_request: async (req, res) => {
    var body = req.body;
    try {
      var user = await lib.userModel.findOne({
        accessToken: req.headers["x-token"],
      });
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }

    var existBooking = await lib.bookingModel.find({
      $and: [
        { userId: user._id },
        { doctorId: body.doctorId },
        { date: body.date },
        { $or: [{ type: "0" }, { type: "1" }] },
      ],
    });
    if (existBooking.length > 0) {
      return res
        .status(202)
        .send({ status: false, code: 202, message: "Request already exist" });
    } else {
      var current = lib.moment().valueOf();
      if (current > body.date) {
        return res
          .status(202)
          .send({
            status: false,
            code: 202,
            message: "Please provide a correct Date",
          });
      } else {
        try {
          var data = {
            userId: user._id,
            date: body.date,
            doctorId: body.doctorId,
          };

          var request_send = new lib.bookingModel(data);
          request_send.save();
          var response = commonfunctions.checkRes(request_send);
          response.message = "Request send successfully";
          logger.info(
            `${req.url},${req.method},${req.hostname},${JSON.stringify(
              response.status
            )}`
          );
          return res.status(200).send(response);
        } catch (e) {
          logger.error(e);
          return res.json({
            status: false,
            code: 201,
            message: messages.ANNONYMOUS,
          });
        }
      }
    }
  },

  accept_or_decline: async (req, res) => {
    var body = req.body;
    try {
      var user = await lib.userModel.findOne({
        accessToken: req.headers["x-token"],
      });
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
    var checkForRequest = await lib.bookingModel.find({
      $and: [{ _id: body.requestId }, { doctorId: user._id }],
    });
    if (
      checkForRequest.length > 0 &&
      checkForRequest[0].type == "0" &&
      (body.type == "1" || body.type == "2")
    ) {
      var updateRequest = await lib.bookingModel.findOneAndUpdate(
        { _id: body.requestId },
        { type: body.type }
      );
      var response = commonfunctions.checkRes(updateRequest);
      response.message =
        body.type == "1" ? "Request accepted" : "Cancelled the request";
      logger.info(
        `${req.url},${req.method},${req.hostname},${JSON.stringify(
          response.status
        )}`
      );
      return res.status(200).send(response);
    } else {
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  },

  home: async (req, res) => {
    try {
      var user = await lib.userModel.findOne({
        accessToken: req.headers["x-token"],
      });
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }

    try {
      var data = await lib.userModel.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [76, 30],
            },
            distanceField: "string",
            spherical: true,
          },
        },
        {
          $match: {
            role: "Doctor",
          },
        },
        {
          "$addFields":{
            "loggedId":user._id
          }
        },
        {
          "$lookup":{
            "from":"favourites",
            "let":{id:"$loggedId","docId":"$_id"},
            "pipeline":[
              {
                "$match":{
                  "$expr":{
                    "$and":[
                      {
                        "$eq":["$favouriteId","$$docId"]
                      },
                      {
                        "$eq":["$userId","$$id"]
                      }
                    ]
                  }
                }
              },
            ],
            as:"favorite"            
          }
        },
        {
          "$unwind":{
            path:"$favorite",
            preserveNullAndEmptyArrays:true
          }
        },
        {
          "$addFields":{
            isFavourite:{"$ifNull":["$favorite",false]}
          }
        },
        {
          $project: {
            email: 1,
            user_name: 1,
            profilePhoto: 1,
            bio: 1,
            isFavourite:{
              "$cond":{
                if:{
                  "$eq":["$isFavourite",false]
                },
                then:false,
                else:true
              }
            }
          },
        },
        {
          $skip: parseInt(req.query["skip"]) * parseInt(req.query["limit"]),
        },
        {
          $limit: parseInt(req.query["limit"]),
        },
      ]);
      console.log(
        parseInt(req.query["skip"]) * parseInt(req.query["limit"]),
        "lklll",
        parseInt(req.query["limit"])
      );
      var dataCount = await lib.userModel.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [76, 30],
            },
            distanceField: "string",
            spherical: true,
          },
        },
        {
          $match: {
            role: "Doctor",
          },
        },
      ]);
      var totalDoc = dataCount.length > 0 ? dataCount.length : 0;
      var response = commonfunctions.checkRes(data);
      response.message = "Near by data";
      response.totalDoc = totalDoc;
      logger.info(
        `${req.url},${req.method},${req.hostname},${JSON.stringify(
          response.status
        )}`
      );
      return res.status(200).send(response);
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  },

  getRequestForUser: async (req, res) => {
    try {
      var user = await lib.userModel.findOne({
        accessToken: req.headers["x-token"],
      });
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
    
    console.log(typeof req.query["type"], ",,,,", user);
    try {
      var data = await lib.bookingModel.aggregate([
        {
          $match: {
            doctorId: mongoose.Types.ObjectId(user._id),
            type: req.query["type"],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "users",
          },
        },
        {
          $unwind: {
            path: "$users",
            includeArrayIndex: "string",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            name: "$users.user_name",
            date: 1,
            conatct:{"$concat":["$users.countryCode","$users.contact"]},
            userId: "$users._id",
            consultingDuration: 1,
            profile: "$users.profilePhoto",
          },
        },
        {
          "$sort":{
            "_id":-1
          }
        }
      ]);

      console.log(data, ".......");

      var response = commonfunctions.checkRes(data);
      response.message = "Request list";
      logger.info(
        `${req.url},${req.method},${req.hostname},${JSON.stringify(
          response.status
        )}`
      );
      return res.status(200).send(response);
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  },

  getstatusForusers: async(req,res)=>{
    try {
      var user = await lib.userModel.findOne({
        accessToken: req.headers["x-token"],
      });
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
    
    console.log(req.query["type"], ",,,,", user);
    try {
      var data = await lib.bookingModel.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(user._id),
            type: req.query["type"],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "doctorId",
            foreignField: "_id",
            as: "users",
          },
        },
        {
          $unwind: {
            path: "$users",
            includeArrayIndex: "string",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            name: "$users.user_name",
            date: 1,
            conatct:{"$concat":["$users.countryCode","$users.contact"]},
            userId: "$users._id",
            consultingDuration: 1,
            profile: "$users.profilePhoto",
          },
        },
        {
          "$sort":{
            _id:-1
          }
        }
      ]);

      console.log(data, ".......");

      var response = commonfunctions.checkRes(data);
      response.message = "Request list";
      logger.info(
        `${req.url},${req.method},${req.hostname},${JSON.stringify(
          response.status
        )}`
      );
      return res.status(200).send(response);
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  },

  addOrRemove:async(req,res)=>{
    var body=req.body
    try {
      var user = await lib.userModel.findOne({
        accessToken: req.headers["x-token"],
      });
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
    console.log(user,"lkkkkk")
    try {
      var existOrnot = await FavModel.find({"$and":[{userId:user._id},{favouriteId:body.id}]})
      console.log(existOrnot,".......////....")
      if(existOrnot.length>0){
        // console.log(existOrnot[0]._id,"/////")
        console.log(existOrnot[0]._id,".......////....")
        var deleteFav= await FavModel.findOneAndDelete({_id:existOrnot[0]._id})
        var response = commonfunctions.checkRes({});
        response.message = "Deleted from favourites";
        // response.totalDoc = totalDoc;
        delete response.results
        logger.info(
          `${req.url},${req.method},${req.hostname},${JSON.stringify(
            response.status
          )}`
        );
        return res.status(200).send(response);
      }else{
        var newFav= new FavModel({
          favouriteId:body.id,
          userId:user._id
        })

        newFav.save()
        var response = commonfunctions.checkRes({});
        response.message = "Added to favourites";
        // response.totalDoc = totalDoc;
        delete response.results
        logger.info(
          `${req.url},${req.method},${req.hostname},${JSON.stringify(
            response.status
          )}`
        );
        return res.status(200).send(response);
      }
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  },
  fav:async(req,res)=>{
    try {
      var user = await lib.userModel.findOne({
        accessToken: req.headers["x-token"],
      });
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }

    try {
      var data = await FavModel.aggregate([{
        '$match': {
          'userId': new mongoose.Types.ObjectId(user._id)
        }
      }, {
        '$lookup': {
          'from': 'users', 
          'localField': 'favouriteId', 
          'foreignField': '_id', 
          'as': 'result'
        }
      }, {
        '$unwind': {
          'path': '$result', 
          'includeArrayIndex': 'string', 
          'preserveNullAndEmptyArrays': false
        }
      }, {
        '$project': {
          'email': '$result.email', 
          'user_name': '$result.user_name', 
          'profilePhoto': '$result.profilePhoto', 
          'bio': '$result.bio',
          "_id":"$result._id"
        }
      },
        {
          $skip: parseInt(req.query["skip"]) * parseInt(req.query["limit"]),
        },
        {
          $limit: parseInt(req.query["limit"]),
        },
      ]);
      console.log(
        parseInt(req.query["skip"]) * parseInt(req.query["limit"]),
        "lklll",
        parseInt(req.query["limit"])
      );
      var dataCount = await FavModel.aggregate([{
        '$match': {
          'userId': new mongoose.Types.ObjectId(user._id)
        }
      }, {
        '$lookup': {
          'from': 'users', 
          'localField': 'favouriteId', 
          'foreignField': '_id', 
          'as': 'result'
        }
      }, {
        '$unwind': {
          'path': '$result', 
          'includeArrayIndex': 'string', 
          'preserveNullAndEmptyArrays': false
        }
      }, {
        '$project': {
          'email': '$result.email', 
          'user_name': '$result.user_name', 
          'profilePhoto': '$result.profilePhoto', 
          'bio': '$result.bio'
        }
      },
      ]);
      var totalDoc = dataCount.length > 0 ? dataCount.length : 0;
      var response = commonfunctions.checkRes(data);
      response.message = "Near by data";
      response.totalDoc = totalDoc;
      logger.info(
        `${req.url},${req.method},${req.hostname},${JSON.stringify(
          response.status
        )}`
      );
      return res.status(200).send(response);
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }
  }
};
