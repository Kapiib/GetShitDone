const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createToken } = require('../utils/jwtUtils');

const saltRounds = 10;

const authController = {
    register: async (req, res) => {
        try {
            const { name, email, password, confirmPassword } = req.body;
            
            if (password !== confirmPassword) {
                return res.status(400).render('register', {
                    title: 'Register',
                    error: 'Passwords do not match',
                });
            }
            
            if (password.length < 3) {
                return res.status(400).render('register', {
                    title: 'Register',
                    error: 'Password must be at least 3 characters',
                });
            }
            
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).render('register', {
                    title: 'Register',
                    error: 'Email is already registered',
                });
            }
            
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
            });
            
            await newUser.save();
            
            res.redirect('/auth/login');
            
        } catch (error) {
            console.error(error);
            res.status(500).render('register', {
                title: 'Register',
                error: 'Server error, please try again',
            });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).render('login', { 
                    title: 'Login',
                    error: 'Invalid email or password' 
                });
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).render('login', { 
                    title: 'Login',
                    error: 'Invalid email or password' 
                });
            }
            
            const payload = {
                userId: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }

            const token = createToken(payload);

            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
            
            res.redirect('/api/profile');
            
        } catch (error) {
            console.error(error);
            res.status(500).render('login', {
                title: 'Login',
                error: 'Server error, please try again'
            });
        }
    },
    logout: (req, res) => {
        res.clearCookie('jwt');
        return res.redirect("/");
    }
}

module.exports = authController;
