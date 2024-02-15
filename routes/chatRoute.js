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
router.get('/chatPage', (req, res) => {
    // Verify the JWT token
    const token = req.cookies && req.cookies.token;
    if (!token) {
        return res.render('login');
    }
    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        const userId = decoded.userId;
        // You can use the userId to fetch user data from the database if needed
        res.render('chatPage');
    } catch (error) {
        console.error(error);
        res.status(403).render('login');
    }
});
module.exports=router;