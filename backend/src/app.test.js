const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app'); // asegúrate de que app.js exporta la instancia de Express

// ⏱️ Ampliamos el timeout para evitar fallos en entornos Docker lentos
jest.setTimeout(15000);

beforeAll(async () => {
  const mongoURL = process.env.MONGO_URL || 'mongodb://mongo:27017/todolist_test';
  await mongoose.connect(mongoURL);
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }
});

describe('API /tasks', () => {
  let id;

  test('POST /tasks - debería crear una tarea', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Tarea de prueba', done: false });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Tarea de prueba');
    id = res.body._id;
  });

  test('GET /tasks - debería devolver la tarea creada', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('title', 'Tarea de prueba');
  });

  test('PUT /tasks/:id - debería actualizar el estado done', async () => {
    const res = await request(app)
      .put(`/tasks/${id}`)
      .send({ title: 'Tarea de prueba', done: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.done).toBe(true);
  });

  test('DELETE /tasks/:id - debería eliminar la tarea', async () => {
    const res = await request(app).delete(`/tasks/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Tarea eliminada');
  });
});
