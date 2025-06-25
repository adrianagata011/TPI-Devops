import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = "http://localhost:4000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    await axios.post(API, { title, done: false });
    setTitle("");
    loadTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    loadTasks();
  };

  const toggleDone = async (task) => {
    await axios.put(`${API}/${task._id}`, { ...task, done: !task.done });
    loadTasks();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>ToDo List</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nueva tarea" />
      <button onClick={addTask}>Agregar</button>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <span
              onClick={() => toggleDone(task)}
              style={{ cursor: 'pointer', textDecoration: task.done ? 'line-through' : 'none' }}
            >
              {task.title}
            </span>
            <button onClick={() => deleteTask(task._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;