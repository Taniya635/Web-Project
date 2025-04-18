const API_URL = 'http://localhost:5000/api';

// Register
if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) window.location.href = 'login.html';
    else alert('Registration failed');
  });
}

// Login
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = 'index.html';
    } else alert('Login failed');
  });
}

// Task
async function loadTasks() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const tasks = await res.json();
  const filter = document.getElementById('filter')?.value || 'all';
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  tasks.filter(task => {
    if (filter === 'all') return true;
    return filter === 'completed' ? task.completed : !task.completed;
  }).forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `<input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask('${task._id}')"> ${task.text} <button onclick="deleteTask('${task._id}')">Delete</button>`;
    list.appendChild(li);
  });
}

if (document.getElementById('taskForm')) {
  document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const text = document.getElementById('taskText').value;
    await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ text })
    });
    document.getElementById('taskText').value = '';
    loadTasks();
  });
  document.getElementById('filter').addEventListener('change', loadTasks);
  loadTasks();
}

async function toggleTask(id) {
  const token = localStorage.getItem('token');
  await fetch(`${API_URL}/tasks/${id}/toggle`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` }
  });
  loadTasks();
}

async function deleteTask(id) {
  const token = localStorage.getItem('token');
  await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  loadTasks();
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}