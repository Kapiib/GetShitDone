// Add or modify this route handler to support AJAX form submission

// In your POST /todos route handler, modify to return JSON when appropriate
router.post('/todos', async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        
        // Create the new todo
        const newTodo = new Todo({
            title,
            description,
            dueDate,
            userId: req.user._id
        });
        
        await newTodo.save();
        
        // Check if the request wants JSON
        const accepts = req.headers.accept || '';
        if (accepts.includes('application/json')) {
            return res.json({ success: true, todo: newTodo });
        }
        
        // Otherwise redirect as usual
        return res.redirect('/todos?date=' + dueDate);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Similar modifications for the delete route
router.delete('/todos/delete/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        
        // Check if the request wants JSON
        const accepts = req.headers.accept || '';
        if (accepts.includes('application/json')) {
            return res.json({ success: true });
        }
        
        // Otherwise redirect as usual
        return res.redirect('/todos?date=' + req.query.date);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
