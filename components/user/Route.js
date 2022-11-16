const express=require('../../index').express;
const router=express.Router();
const lib= require('../../index');
const joiValidation=require('../joivalidation')
const userService = require('./Service')



router.post("/user/generateOTP",joiValidation,userService.generateOtp);
router.post('/user/resendOTP',joiValidation,userService.resendOtp);
router.post('/user/verifyOTP',joiValidation,userService.verifyOTP);
router.get('/user/emailverify/:id/:token',userService.emailVerified);
router.post('/user/register',joiValidation,userService.register);
router.post('/user/login',joiValidation,userService.login);
router.post('/user/forgotPassword',joiValidation,userService.forgotPassword);
router.post('/user/verifyEmailOtp',joiValidation,userService.verifyEmailOtp);
router.post('/user/newPassword',joiValidation,userService.newPassword);
router.post('/user/resetPassword',joiValidation,userService.resetPassword);
router.post('/user/logout',userService.logOut)
router.get('/user/testApi',async(req,res)=>{
    res.render('linkexpired')
})
async function isAuthenticated(req,res,next) {
    let givenToken=req.headers['x_tokken']||req.query['token'];
    let existingToken= await lib.userModel.findOne({accessToken:givenToken})
    if(!existingToken) {
        return res.send({status:false,code:203,message:message.SESSION_ERROR});
    }else if(existingToken.adminBlock==true){
        return res.send({status:false,code:203,message:message.BLOCKED_BY_ADMIN});
    }
    else{
        if(givenToken==existingToken.accessToken){
            lib.jwt.verify(givenToken,process.env.JWT_SECRET,(err,result)=>{
                if(err) return res.send({status:false,code:203,message:message.SESSION_ERROR});
                else 
                req.body.userId=existingToken._id.toString();
                next()
            })
          } else {
            return res.send({status:false,code:203,message:message.SESSION_ERROR})
         }
    }
   
    
      
}



/**
 * @swagger
 * /user/generateOTP:
 *   post:
 *     summary: generate otp
 *     description: email is required
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *                type: string
 *     responses:
 *       200:
 *         description: user login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/resendOTP:
 *   post:
 *     summary: generate otp
 *     description: email, contact and countryCode is required
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              contact:
 *                type: string
 *              countryCode:
 *                type: string          
 *     responses:
 *       200:
 *         description: user login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/verifyOTP:
 *   post:
 *     summary: generate otp
 *     description: email, contact and countryCode is required
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *                type: string      
 *              otp:
 *                type: string       
 *     responses:
 *       200:
 *         description: user login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Please use this api after the otp verification
 *     description: required fields are user_name email password longitude latitude device_Token device_type app_version device_model
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              contact:
 *                type: string
 *              countryCode:
 *                type: string         
 *              user_name:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              longitude:
 *                type: string   
 *              latitude:
 *                type: string   
 *              role:
 *                type: string  
 *     responses:
 *       200:
 *         description: user login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: login Api
 *     description: required fields are  longitude latitude device_Token device_type app_version device_model
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              contact:
 *                type: string
 *              countryCode:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              longitude:
 *                type: string   
 *              latitude:
 *                type: string   
 *     responses:
 *       200:
 *         description: user login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/forgotPassword:
 *   post:
 *     summary: forgot password
 *     description: email is a required field
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *                type: string   
 *     responses:
 *       200:
 *         description: user login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/verifyEmailOtp:
 *   post:
 *     summary: otp verification based on email
 *     description: email and otp is a required field
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *                type: string   
 *              otp:
 *                type: string   
 *     responses:
 *       200:
 *         description: user login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/newPassword:
 *   post:
 *     summary: change your password
 *     description: email and password is a required field
 *     tags: [users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              email:
 *                type: string   
 *              password:
 *                type: string   
 *     responses:
 *       200:
 *         description: user login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */
 
/**
 * @swagger
 * /user/resetPassword:
 *   post:
 *     summary: change your password
 *     description: old_password and new_password both are required
 *     tags: [users]
 *     parameters:
 *      - in: header
 *        name: x_tokken
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              old_password:
 *                type: string   
 *              new_password:
 *                type: string   
 *     responses:
 *       200:
 *         description: user login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: log out api
 *     description: accesstoken required
 *     tags: [users]
 *     parameters:
 *      - in: header
 *        name: x_tokken
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       200:
 *         description: user login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */
module.exports=router;