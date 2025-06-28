require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión se hace desde server.js o test explícitamente

const Task = mongoose.model('Task', { title: String, done: Boolean });

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  // Incrementa el contador de creación de tareas
  tasksCounter.inc({ action: 'created' });
  res.json(task);
});

app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  // Incrementa el contador de actualización de tareas
  tasksCounter.inc({ action: 'updated' });
  res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  // Incrementa el contador de eliminación de tareas
  tasksCounter.inc({ action: 'deleted' });
  res.json({ message: 'Tarea eliminada' });
});
// inicio mod cliente de métricas
const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();

// Add a default label (optional)
register.setDefaultLabels({
  app: 'my-app'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });


// Define custom metrics
const tasksCounter = new client.Counter({
  name: 'tasks_total',
  help: 'Total number of tasks',
  labelNames: ['action']
});
register.registerMetric(tasksCounter);

// Create a metrics endpoint
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});
// fin mod cliente de métricas

// 👉 Exportamos la app sin escuchar puerto
module.exports = app;
