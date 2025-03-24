const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { authenticateUser } = require('../utils/authMiddleware');

// All todo routes require authentication
router.use(authenticateUser);

// Only keep POST route here
router.post('/', todoController.createTodo);

module.exports = router;
