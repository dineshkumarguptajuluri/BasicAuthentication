const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken library
const User = require('./models/User');
require('dotenv').config();
const dburl = process.env.URL;

mongoose.connect('mongodb+srv://dinnu:dinnu@cluster0.ciq0jbr.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

db.once('open', () => {
    console.log('MongoDb Connected');
});

// Secret key for signing JWT tokens
const jwtSecretKey = 'your-secret-key';

app.post('/signup', async (req, res) => {
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

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            res.send('User not found');
            return;
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.send('Invalid Password');
            return;
        }
        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, jwtSecretKey, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.render('dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

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
