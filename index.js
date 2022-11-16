
module.exports={
    express:require("express"),
    http:require("http"),
    Mongo:require("mongoose"),
    jwt:require("jsonwebtoken"),
    crypto :require('crypto'),
    joi:require("joi"),
    winston:require("winston"),
    userModel:require("./Models/UserModels/User"),
    bodyParser: require('body-parser'),
    otpModel: require('./Models/UserModels/OtpModel'),
    cors:require('cors'),
    crypto:require('crypto'),
    hbs:require('express-handlebars'),
    path:require('path'),
    nodemailerHbs:require('nodemailer-express-handlebars'),
    nodemailer:require('nodemailer'),
    fs:require('fs'),
    adminModel:require("./Models/AdminModels/AdminModel")
}
