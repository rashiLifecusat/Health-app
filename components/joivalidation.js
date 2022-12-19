var Joi = require("joi");
module.exports = (req, res, next) => {
  const otpScheama = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
      user_name:Joi.string().required(),
      password: Joi.string().required(),
      contact: Joi.string().optional().allow(""),
      countryCode: Joi.string().optional().allow(""),
      longitude:Joi.number().optional().allow(""),
      latitude:Joi.number().optional().allow(""),
      role: Joi.string().optional().allow("")
  });

  const resendOtpSchema= Joi.object({
    contact: Joi.string().required(),
    countryCode: Joi.string().required()
  })

  const verifyOtp = Joi.object({
    email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
    otp: Joi.string().required()
  })

  const register = Joi.object({
    user_name:Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    contact: Joi.string().optional().allow(""),
    countryCode: Joi.string().optional().allow(""),
    longitude:Joi.string().required(),
    latitude:Joi.string().required(),
    role: Joi.string().optional().allow("")
  })

  const login = Joi.object({
    "email": Joi.string().optional().allow(""),
    "password": Joi.string().optional().allow(""),
    "longitude": Joi.string().required(),
    "latitude": Joi.string().required(),
  })

  const forgotPassword= Joi.object({
    email:Joi.string().required()
  })

  const emailOtp= Joi.object({
    email:Joi.string().required(),
    otp:Joi.string().required()
  })

  const newPassword= Joi.object({
    email:Joi.string().required(),
    password:Joi.string().required()
  })
  const resetPassword= Joi.object({
    old_password:Joi.string().required(),
    new_password:Joi.string().required()
  })

  const adminLogin= Joi.object({
    email:Joi.string().required(),
    password:Joi.string().required()
  })

  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };

  console.log("kkk",req.body)
  // paths
  if (req.path == "/user/generateOTP") var { error, value } = otpScheama.validate(req.body, options);
  if (req.path == "/user/resendOTP") var { error, value } = resendOtpSchema.validate(req.body, options);
  if (req.path == "/user/verifyOTP") var { error, value } = verifyOtp.validate(req.body, options);
  // if (req.path == "/user/register") var { error, value } = register.validate(req.body, options);
  if (req.path == "/user/login") var { error, value } = login.validate(req.body, options);
  if (req.path == "/user/forgotPassword") var { error, value } = forgotPassword.validate(req.body, options);
  if (req.path == "/user/verifyEmailOtp") var { error, value } = emailOtp.validate(req.body, options);
  if (req.path == "/user/newPassword") var { error, value } = newPassword.validate(req.body, options);
  if (req.path == "/user/resetPassword") var { error, value } = resetPassword.validate(req.body, options);
  if (req.path == "/admin/login") var { error, value } = adminLogin.validate(req.body, options);
  if (error) {
    // returning the error if there is anything
    return res.json({
      status: false,
      code: 201,
      message: `${error.details.map((x) => x.message.replace(/"/g, ""))[0]}`,
    });
  } else {
    req.body = value;
    next();
  }
};
