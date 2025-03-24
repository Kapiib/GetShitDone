document.addEventListener('DOMContentLoaded', function() {
    // Current date from the page
    const currentDate = document.getElementById('currentDate').value;
    let todoToDelete = null;
    const modal = document.getElementById('deleteModal');
    const todoForm = document.querySelector('form[action="/todos"]');
    const todosList = document.querySelector('.todos-list');

    // Initialize event listeners for existing todo items
    setupToggleButtons();
    setupDeleteButtons();

    // Close modal when cancel button is clicked
    if (document.getElementById('cancelDelete')) {
        document.getElementById('cancelDelete').addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Handle form submission via AJAX to prevent page reload
    if (todoForm) {
        todoForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            try {
                const response = await fetch('/todos', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: new URLSearchParams(formData)
                });
                
                if (response.ok) {
                    const result = await response.json();
                    
                    // Create and append the new todo item to the list
                    const newTodoHtml = createTodoElement(result.todo);
                    
                    // If there's a "no tasks" message, remove it
                    const noTodos = document.querySelector('.no-todos');
                    if (noTodos) {
                        noTodos.remove();
                    }
                    
                    // Add the new todo to the list
                    todosList.insertAdjacentHTML('beforeend', newTodoHtml);
                    
                    // Clear the form
                    this.reset();
                    
                    // Set up event listeners for the new todo buttons
                    setupToggleButtons();
                    setupDeleteButtons();
                } else {
                    alert('There was an error adding the task.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Set up toggle functionality
    function setupToggleButtons() {
        document.querySelectorAll('.toggle-btn').forEach(button => {
            button.removeEventListener('click', toggleTodo);
            button.addEventListener('click', toggleTodo);
        });
    }

    async function toggleTodo() {
        const todoId = this.getAttribute('data-id');
        const isCompleted = this.getAttribute('data-completed') === 'true';
        
        try {
            const response = await fetch(`/todos/toggle/${todoId}?date=${currentDate}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                // Update UI without page reload
                const todoItem = document.getElementById(`todo-${todoId}`);
                if (isCompleted) {
                    todoItem.classList.remove('completed');
                    this.innerHTML = '✓';
                    this.setAttribute('data-completed', 'false');
                } else {
                    todoItem.classList.add('completed');
                    this.innerHTML = '↩️';
                    this.setAttribute('data-completed', 'true');
                }
            } else {
                alert('Error toggling task status');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Set up delete functionality
    function setupDeleteButtons() {
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.removeEventListener('click', showDeleteModal);
            button.addEventListener('click', showDeleteModal);
        });
    }

    function showDeleteModal() {
        todoToDelete = this.getAttribute('data-id');
        modal.style.display = 'block';
    }

    // Delete confirmation
    if (document.getElementById('confirmDelete')) {
        document.getElementById('confirmDelete').addEventListener('click', async function() {
            if (todoToDelete) {
                try {
                    const response = await fetch(`/todos/delete/${todoToDelete}?date=${currentDate}`, {
                        method: 'DELETE',
                        headers: { 'Accept': 'application/json' }
                    });
                    
                    if (response.ok) {
                        // Remove todo from UI
                        document.getElementById(`todo-${todoToDelete}`).remove();
                        
                        // Check if we need to show the "no todos" message
                        if (todosList.children.length === 0) {
                            todosList.innerHTML = '<div class="no-todos">No tasks for this day</div>';
                        }
                        
                        // Hide the modal
                        modal.style.display = 'none';
                    } else {
                        alert('There was an error deleting the task.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        });
    }

    // Helper function to create a new todo element
    function createTodoElement(todo) {
        return `
            <div class="todo-item ${todo.completed ? 'completed' : ''}" id="todo-${todo._id}">
                <div class="todo-content">
                    <h4>${todo.title}</h4>
                    ${todo.description ? `<p>${todo.description}</p>` : ''}
                </div>
                <div class="todo-actions">
                    <button class="toggle-btn" data-id="${todo._id}" data-completed="${todo.completed}">
                        ${todo.completed ? '↩️' : '✓'}
                    </button>
                    <button class="delete-btn" data-id="${todo._id}">🗑️</button>
                </div>
            </div>
        `;
    }
});
