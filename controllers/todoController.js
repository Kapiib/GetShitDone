const Todo = require('../models/Todo');

const todoController = {
    // Get todos for a specific date
    getTodos: async (req, res) => {
        try {
            const { date } = req.query;
            let queryDate;
            
            if (date) {
                // Fix date parsing by manually constructing the date
                const parts = date.split('-');
                if (parts.length === 3) {
                    // Create date using year, month (0-indexed), day
                    queryDate = new Date(
                        parseInt(parts[0]), 
                        parseInt(parts[1]) - 1, 
                        parseInt(parts[2])
                    );
                } else {
                    queryDate = new Date();
                }
            } else {
                queryDate = new Date();
            }
            
            // Reset time part to avoid timezone issues
            queryDate.setHours(0, 0, 0, 0);
            
            // End of day
            const nextDay = new Date(queryDate);
            nextDay.setDate(queryDate.getDate() + 1);
            
            const todos = await Todo.find({
                user: req.user.userId,
                dueDate: {
                    $gte: queryDate,
                    $lt: nextDay
                }
            }).sort({ completed: 1, createdAt: -1 });
            
            // Create formatted strings for display and navigation
            const formattedDate = `${queryDate.getFullYear()}-${String(queryDate.getMonth() + 1).padStart(2, '0')}-${String(queryDate.getDate()).padStart(2, '0')}`;
            
            // Previous day - create a new date object and modify it
            const previousDate = new Date(queryDate);
            previousDate.setDate(previousDate.getDate() - 1);
            const previousDateStr = `${previousDate.getFullYear()}-${String(previousDate.getMonth() + 1).padStart(2, '0')}-${String(previousDate.getDate()).padStart(2, '0')}`;
            
            // Next day - create a new date object and modify it
            const nextDate = new Date(queryDate);
            nextDate.setDate(nextDate.getDate() + 1);
            const nextDateStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
            
            res.render('todos', {
                title: 'Fiks ferdig',
                todos,
                currentDate: formattedDate,
                previousDate: previousDateStr,
                nextDate: nextDateStr,
                formatDate: (date) => {
                    const dateObj = new Date(date);
                    return dateObj.toLocaleDateString('nb-NO', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    },
    
    // Create new todo
    createTodo: async (req, res) => {
        try {
            const { title, description, dueDate } = req.body;
            
            const newTodo = new Todo({
                title,
                description,
                dueDate: dueDate || Date.now(),
                user: req.user.userId
            });
            
            await newTodo.save();
            
            // Redirect back to the same date view
            res.redirect(`/todos?date=${new Date(dueDate).toISOString().split('T')[0]}`);
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    },
    
    // Toggle todo completion status
    toggleComplete: async (req, res) => {
        try {
            const { id } = req.params;
            const todo = await Todo.findById(id);
            
            // Check if todo exists and belongs to user
            if (!todo || todo.user.toString() !== req.user.userId) {
                return res.status(404).send('Todo not found');
            }
            
            todo.completed = !todo.completed;
            await todo.save();
            
            // Toggle code - ensure this part supports AJAX
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.json({ success: true, completed: todo.completed });
            }
            
            // Return to the same date view
            const date = req.query.date || new Date().toISOString().split('T')[0];
            res.redirect(`/todos?date=${date}`);
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    },
    
    // Delete todo
    deleteTodo: async (req, res) => {
        try {
            const { id } = req.params;
            const todo = await Todo.findById(id);
            
            // Check if todo exists and belongs to user
            if (!todo || todo.user.toString() !== req.user.userId) {
                return res.status(404).send('Todo not found');
            }
            
            await Todo.findByIdAndDelete(id);
            
            // Delete code - ensure this part supports AJAX
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.json({ success: true });
            }
            
            // Return to the same date view
            const date = req.query.date || new Date().toISOString().split('T')[0];
            res.redirect(`/todos?date=${date}`);
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }
};

module.exports = todoController;
