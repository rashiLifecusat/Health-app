const express=require('../../index').express;
const router=express.Router();
const lib= require('../../index');
const joiValidation=require('../joivalidation')
const adminService= require('./Service')
router.post('/admin/login',joiValidation,adminService.login)

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

module.exports=router;