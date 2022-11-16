const lib = require("../../index");
var logger = require("../../config/logger");
const commonfunctions = require("../commonfunctions");
const messages = commonfunctions.customMessages();
const env = require("../../env");
const mongoose = require("mongoose");
require("dotenv").config();
var appCred = require("../../config/appcredentials")[env.instance];

const getHashedPassword = (password) => {
  const sha256 = lib.crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

module.exports = {
  createAdmin: async (req, res) => {
    try {
      var adminExist = await lib.adminModel.find({});
      if (adminExist.length > 0) {
        var adminFind = await lib.adminModel({ email: adminExist[0].email });
        if (adminFind) {
          logger.info("Admin already exist");
        } else {
          var data = {
            password: getHashedPassword("admin@123"),
            email: "taplist@admin.com",
            name: "taplist_admin",
          };
          var newAdmin = new lib.adminModel(data);
          newAdmin.save();
          logger.info("Admin created successFully");
        }
      } else {
        try {
          var data = {
            password: getHashedPassword("admin@123"),
            email: "taplist@admin.com",
            name: "taplist_admin",
          };
          var newAdmin = new lib.adminModel(data);
          newAdmin.save();
          logger.info("Admin created successFully");
        } catch (e) {
          logger.error(e);
        }
      }
    } catch (e) {
      logger.error(e);
    }
  },
  login: async (req,res) => {
    var body = req.body;
    try {
      var adminFind = await lib.adminModel.findOne({ email: body.email });
    } catch (e) {
      logger.error(e);
      return res.json({
        status: false,
        code: 201,
        message: messages.ANNONYMOUS,
      });
    }

    try {
        if(adminFind){
            var hashedPassword= getHashedPassword(body.password);
            if(hashedPassword==adminFind.password){
                var Token = lib.jwt.sign(
                    { _id: adminFind._id },
                    process.env.JWT_SECRET
                  );
                  var updateAdmin = await lib.adminModel.updateMany({_id:adminFind._id},
                  {
                    accessToken:Token
                  },{upsert:true})
                  var response = commonfunctions.checkRes(updateAdmin);
                    response.message=messages.LOGIN
                    response.accessToken=Token
                    response.adminId=adminFind._id
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
                    message: messages.PWD_INC,
                  });
            }
        }else{
            return res.json({
                status: false,
                code: 201,
                message: messages.EMAIL_NOT_EXIST,
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
};
