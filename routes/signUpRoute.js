const express=require('express');
const routes=express.Router();
const User=require('../models/User');
const cookieParser = require('cookie-parser');
const bodyParser=require('body-parser')
//routes.use(bodyParser);
routes.use(express.json());

// Middleware to parse URL-encoded bodies
routes.use(express.urlencoded({ extended: true }));
routes.use(cookieParser());

routes.get('/',(req,res)=>{
res.render('signup');
})

routes.post('/', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({
            username,
            email,
            password
        });
        await newUser.save();
        console.log('New User Created');
        res.render('login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
module.exports=routes;