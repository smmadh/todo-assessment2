window.addEventListener('load', () => {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');
 
    const username = localStorage.getItem('username') || '';
    nameInput.value = username;
 
    // Save username to localStorage when changed
    nameInput.addEventListener('change', (e) => {
        localStorage.setItem('username', e.target.value);
    });
    
 
    // Add event listener for form submission
    newTodoForm.addEventListener('submit', e => {
        e.preventDefault();
 
        const contentInput = e.target.elements.content.value.trim();
        const category = e.target.elements.category.value;
 
        // Validation: Task content should be between 3 and 100 alphanumeric characters
        const taskRegex = /^[A-Za-z0-9 ]{3,100}$/;
 
        if (!taskRegex.test(contentInput)) {
            alert('Task content must be between 3 and 100 alphanumeric characters.');
            return; // Do not proceed if validation fails
        }
 
        // Check if category is selected
        if (!category) {
            alert('Please select a category.');
            return; // Do not proceed if category is not selected
        }
 
        const todo = {
            content: contentInput,
            category: category,
            done: false,
            createdAt: new Date().getTime(),
        };
 
        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
 
        // Reset the form
        e.target.reset();
 
        // Display updated todos
        DisplayTodos();
    });
 
    // Function to display todos
    DisplayTodos();
});
 
function DisplayTodos() {
    const todoList = document.querySelector('#todo-list');
    todoList.innerHTML = "";
 
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
 
    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');
 
        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const content = document.createElement('div');
        const actions = document.createElement('div');
        const edit = document.createElement('button');
        const deleteButton = document.createElement('button');
 
        input.type = 'checkbox';
        input.checked = todo.done;
        span.classList.add('bubble');
 
        if (todo.category == 'personal') {
            span.classList.add('personal');
        } else {
            span.classList.add('business');
        }
 
        content.classList.add('todo-content');
        actions.classList.add('actions');
        edit.classList.add('edit');
        deleteButton.classList.add('delete');
 
        content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
        edit.innerHTML = 'Edit';
        deleteButton.innerHTML = 'Delete';
 
        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(edit);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(actions);
 
        todoList.appendChild(todoItem);
 
        if (todo.done) {
            todoItem.classList.add('done');
        }
 
        // Checkbox listener
        input.addEventListener('change', (e) => {
            todo.done = e.target.checked;
            localStorage.setItem('todos', JSON.stringify(todos));
 
            if (todo.done) {
                todoItem.classList.add('done');
            } else {
                todoItem.classList.remove('done');
            }
 
            DisplayTodos();
        });
 
        // Edit button listener
        edit.addEventListener('click', (e) => {
            const input = content.querySelector('input');
            input.removeAttribute('readonly');
            input.focus();
            input.addEventListener('blur', (e) => {
                input.setAttribute('readonly', true);
                todo.content = e.target.value;
                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos();
            });
        });
 
        // Delete button listener
        deleteButton.addEventListener('click', (e) => {
            todos = todos.filter(t => t != todo);
            localStorage.setItem('todos', JSON.stringify(todos));
            DisplayTodos();
        });
    });
}