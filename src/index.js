app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>📝 To-Do API</title>
  <style>
    body { font-family: sans-serif; max-width: 600px; margin: 2rem auto; }
    h1 { text-align: center; }
    ul { list-style: none; padding: 0; }
    li { 
      display: flex; 
      justify-content: space-between; 
      background: #f9f9f9; 
      margin: 0.5rem 0; 
      padding: 0.5rem; 
      border-radius: 4px;
    }
    button { background: #e74c3c; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 3px; cursor: pointer; }
    form { display: flex; margin-top: 1rem; }
    input { flex: 1; padding: 0.5rem; border: 1px solid #ccc; border-radius: 3px; }
    input, button { font-size: 1rem; }
    button[type="submit"] { background: #2ecc71; margin-left: 0.5rem; }
  </style>
</head>
<body>
  <h1>📝 To-Do List</h1>
  <ul id="todo-list"></ul>
  <form id="todo-form">
    <input type="text" id="todo-text" placeholder="New to-do…" required />
    <button type="submit">Add</button>
  </form>

  <script>
    const listEl = document.getElementById('todo-list');
    const form = document.getElementById('todo-form');
    const textInput = document.getElementById('todo-text');

    async function loadTodos() {
      const res = await fetch('/todos');
      const todos = await res.json();
      listEl.innerHTML = todos.map(t => \`
        <li>
          <span>\${t.text}</span>
          <button onclick="deleteTodo(\${t.id})">Delete</button>
        </li>
      \`).join('');
    }

    async function addTodo(text) {
      await fetch('/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      textInput.value = '';
      loadTodos();
    }

    async function deleteTodo(id) {
      await fetch(\`/todos/\${id}\`, { method: 'DELETE' });
      loadTodos();
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      addTodo(textInput.value);
    });

    // initial load
    loadTodos();
  </script>
</body>
</html>`);
});

// src/index.js
const express = require('express');
const app = express();
app.use(express.json());

let todos = [];
let nextId = 1;

// List all
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Get one
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: 'Not found' });
  res.json(todo);
});

// Create
app.post('/todos', (req, res) => {
  const todo = { id: nextId++, text: req.body.text || '' };
  todos.push(todo);
  res.status(201).json(todo);
});

// Update
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: 'Not found' });
  todo.text = req.body.text ?? todo.text;
  res.json(todo);
});

// Delete
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const [deleted] = todos.splice(idx, 1);
  res.json(deleted);
});

// Only start server when run directly
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`To-Do API listening on port ${port}`));
}

module.exports = app;
