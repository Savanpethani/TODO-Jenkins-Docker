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
