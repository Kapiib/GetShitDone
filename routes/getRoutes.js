const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../utils/authMiddleware');
const todoController = require('../controllers/todoController');

// Public Routes
router.get('/', (req, res) => {
    res.render('index', { title: 'Dashboard' });
});

router.get('/auth/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.get('/auth/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Private Routes
router.get('/api/profile', authenticateUser, (req, res) => {
    res.render('profile', { title: 'Profile', user: req.user });
});

// Todo GET Routes
router.get('/todos', authenticateUser, todoController.getTodos);
router.get('/todos/toggle/:id', authenticateUser, todoController.toggleComplete);
router.get('/todos/delete/:id', authenticateUser, todoController.deleteTodo);

module.exports = router;
