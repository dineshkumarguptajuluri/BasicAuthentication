const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const User=require('../models/User');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const sendOTPEmail=require('../controllers/Mail');
const jwtSecretKey = 'your-secret-key';
router.use(cookieParser());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());
router.post('/', async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        if(user.email!=email)
        return res.send("Incorrect email is entered");

        const otp = generateOTP();
        const token = jwt.sign({ userId: user.id, otp }, jwtSecretKey, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        await sendOTPEmail(user.email, otp);

        return res.render('resetPassword');
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});
function generateOTP() {
    console.log('otp generated');
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  module.exports=router;