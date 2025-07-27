import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 👇 This ensures cookies are sent with every request (for session/login)
//axios.defaults.withCredentials = true;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const showMessage = (type, msg) => {
    setErrorMsg('');
    setSuccessMsg('');
    if (type === 'error') setErrorMsg(msg);
    else setSuccessMsg(msg);

    setTimeout(() => {
      setErrorMsg('');
      setSuccessMsg('');
    }, 5000);
  };

  const login = async () => {
    if (!credentials.username || !credentials.password) {
      showMessage('error', 'Please enter both username and password');
      return;
    }

    try {
      await axios.post('https://simple-todo-app-backend-axk7.onrender.com/api/login', credentials);
      setIsLoggedIn(true);
      showMessage('success', 'Login successful');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        showMessage('error', 'Invalid username or password');
      } else {
        showMessage('error', 'Server error. Please try again later');
      }
    }
  };

  const fetchTodos = async () => {
    try {
      const res = await axios.get('https://simple-todo-app-backend-axk7.onrender.com/api/todos');
      setTodos(res.data);
    } catch (err) {
      showMessage('error', 'Failed to fetch todos');
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchTodos();
  }, [isLoggedIn]);

  const addTodo = async () => {
    if (!newTodo.trim()) {
      showMessage('error', 'Todo cannot be empty');
      return;
    }

    try {
      await axios.post('https://simple-todo-app-backend-axk7.onrender.com/api/todos', { text: newTodo });
      setNewTodo('');
      fetchTodos();
      showMessage('success', 'Todo added successfully');
    } catch (err) {
      showMessage('error', 'Failed to add todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`https://simple-todo-app-backend-axk7.onrender.com/api/todos/${id}`);
      fetchTodos();
      showMessage('success', 'Todo deleted successfully');
    } catch (err) {
      showMessage('error', 'Failed to delete todo');
    }
  };

  const updateTodo = async () => {
    if (!editTodoText.trim()) {
      showMessage('error', 'Updated todo cannot be empty');
      return;
    }

    try {
      await axios.put(`https://simple-todo-app-backend-axk7.onrender.com/api/todos/${editTodoId}`, { text: editTodoText });
      setEditTodoId(null);
      setEditTodoText('');
      fetchTodos();
      showMessage('success', 'Todo updated successfully');
    } catch (err) {
      showMessage('error', 'Failed to update todo');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
        {errorMsg && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4" data-testid="error-msg">{errorMsg}</div>}
        {successMsg && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4" data-testid="success-msg">{successMsg}</div>}

        {!isLoggedIn ? (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
            <input
              className="w-full p-2 border border-gray-300 rounded mb-3"
              placeholder="Username"
              onChange={e => setCredentials({ ...credentials, username: e.target.value })}
            />
            <input
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Password"
              type="password"
              onChange={e => setCredentials({ ...credentials, password: e.target.value })}
            />
            <button
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              onClick={login}
            >
              Login
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">Todo App</h2>

            <div className="flex mb-4">
              <input
                className="flex-grow p-2 border border-gray-300 rounded-l"
                value={newTodo}
                onChange={e => setNewTodo(e.target.value)}
                placeholder="Add new todo"
              />
              <button
                className="bg-green-500 text-white px-4 rounded-r hover:bg-green-600"
                onClick={addTodo}
              >
                Add
              </button>
            </div>

            <ul className="space-y-2">
              {todos.map(todo => (
                <li
                  key={todo.id}
                  className="flex justify-between items-center p-2 bg-gray-50 border rounded"
                >
                  {editTodoId === todo.id ? (
                    <>
                      <input
                        className="flex-grow p-1 mr-2 border rounded"
                        value={editTodoText}
                        onChange={e => setEditTodoText(e.target.value)}
                      />
                      <button
                        className="text-sm text-green-600 mr-2 hover:underline"
                        onClick={updateTodo}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-grow">{todo.text}</span>
                      <button
                        className="text-sm text-blue-600 mr-2 hover:underline"
                        onClick={() => {
                          setEditTodoId(todo.id);
                          setEditTodoText(todo.text);
                        }}
                      >
                        Edit
                      </button>
                    </>
                  )}
                  <button
                    className="text-sm text-red-600 hover:underline"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
