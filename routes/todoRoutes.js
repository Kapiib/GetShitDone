const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { authenticateUser } = require('../utils/authMiddleware');

// All todo routes require authentication
router.use(authenticateUser);

// Only keep POST route here
router.post('/', todoController.createTodo);

// Delete route
router.delete('/todos/:id', todoController.deleteTodo);

// Delete todo route
router.delete('/delete/:id', todoController.deleteTodo);
// OR if your app is structured differently:
// router.delete('/todos/delete/:id', todoController.deleteTodo);

module.exports = router;
