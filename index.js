const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken library
const User = require('./models/User');
const loginRoute=require('./routes/loginRoute');
const signupRoute=require('./routes/signUpRoute');
const updateRoute=require('./routes/updateRoute');
const resetRoute=require('./routes/resetRoute');
mongoose.connect('mongodb+srv://dinnu:dinnu@cluster0.ciq0jbr.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
app.use('/login',loginRoute);
app.use('/signup',signupRoute);
app.use('/resetPassword',resetRoute);
app.use('/updatePassword',updateRoute);
app.use(express.json());

// Middleware to parse URL-encoded bodies
//app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

db.once('open', () => {
    console.log('MongoDb Connected');
});

// Secret key for signing JWT tokens
const jwtSecretKey = 'your-secret-key';
app.get('/',(req,res)=>{
    res.send("Hello Guys");
})
app.get('/dashboard', (req, res) => {
    // Verify the JWT token
    const token = req.cookies && req.cookies.token;
    if (!token) {
        return res.render('login');
    }
    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        const userId = decoded.userId;
        // You can use the userId to fetch user data from the database if needed
        res.render('dashboard');
    } catch (error) {
        console.error(error);
        res.status(403).render('login');
    }
});

const port = 3000;
app.listen(port, () => {
    console.log('Application started');
});
