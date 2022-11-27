const express=require('../../index').express;
const router=express.Router();
const lib= require('../../index');
const joiValidation=require('../joivalidation')
const adminService= require('./Service')

const multerStorage=lib.multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./public/Category')
    },
    filename:(req,file,cb)=>{
        req.body.image= file ? "FILE-" + Date.now() + (file.originalname) : ""
        cb(null,"FILE-" + Date.now() + (file.originalname))
    }
});
var categoryImage= lib.multer({
    storage:multerStorage
})

router.post('/admin/login',joiValidation,adminService.login)
router.post('/admin/createCategory',categoryImage.single('image'),adminService.createCategory)

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: login Api
 *     description: required fields are  email and password
 *     tags: [admin]
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
 * /admin/createCategory:
 *   post:
 *     summary:  create new add
 *     description: adminId and token required
 *     tags: [admin]
 *     parameters:
 *      - in: header
 *        description: required
 *        name: x-token
 *        schema:
 *          type: string
 *     requestBody:
 *       required: true
 *       content:
 *        multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *              image:
 *                type: string
 *                format: binary
 *              category:
 *                type: string
 *     responses:
 *       200:
 *         description: logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Some server error
 */


module.exports=router;