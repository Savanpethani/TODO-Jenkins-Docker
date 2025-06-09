const express = require('express');
const app = express();
app.use(express.json());

let todos = [];
let nextId = 1;

// GET /todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// POST /todos
app.post('/todos', (req, res) => {
  const todo = { id: nextId++, text: req.body.text || '' };
  todos.push(todo);
  res.status(201).json(todo);
});

// (you can scaffold PUT, DELETE later)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`To-Do API listening on port ${port}`);
});
