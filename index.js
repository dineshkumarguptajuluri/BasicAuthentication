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
const chatRoute=require('./routes/chatRoute');
mongoose.connect('mongodb+srv://dinnu:dinnu@cluster0.ciq0jbr.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
app.use('/login',loginRoute);
app.use('/signup',signupRoute);
app.use('/resetPassword',resetRoute);
app.use('/updatePassword',updateRoute);
app.use(express.json());
app.use('/chatPage',chatRoute);

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


const port = 3000;
app.listen(port, () => {
    console.log('Application started');
});
