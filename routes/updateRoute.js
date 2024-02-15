const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const User=require('../models/User');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const jwtSecretKey = 'your-secret-key';
router.use(cookieParser());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

router.post('/', async (req, res) => {
    const { otp, password } = req.body;
    console.log(req.cookies.token);

    try {
        const decoded = jwt.verify(req.cookies.token, jwtSecretKey);
        console.log(decoded);

        const userId = decoded.userId;
        const user = await User.findOne({ id: userId });
        if(otp!=decoded.otp)
        return res.send("OTP is incorrectly Entered");
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        

        user.password = password;
        await user.save();

        return res.json({ status: 'success', message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ status: 'error', message: 'Malformed token or invalid signature' });
        }
        res.status(403).json({ status: 'error', message: 'Invalid or expired token' });
    }
});
module.exports=router;
