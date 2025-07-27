const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();


app.use(cors({origin:'https://simple-todo-app-snowy-three.vercel.app'}));
app.use(express.json());

let todos = [];
let user = { username: "Arshad", password: "Arshad@7" };

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && password === user.password) {
    return res.status(200).json({ message: 'Login successful' });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

// Get all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// Add todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  const newTodo = { id: Date.now(), text };
  todos.push(newTodo);
  res.json(newTodo);
});

// Edit todo
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  todos = todos.map(todo => todo.id == id ? { ...todo, text } : todo);
  res.json({ message: "Todo updated" });
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter(todo => todo.id != id);
  res.json({ message: "Todo deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
