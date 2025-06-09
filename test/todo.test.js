// test/todo.test.js
const request = require('supertest');
const app = require('../src/index');

describe('To-Do API Endpoints', () => {
  it('GET /todos → empty array', async () => {
    const res = await request(app).get('/todos');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /todos → create item', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ text: 'Test todo' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ id: 1, text: 'Test todo' });
  });

  it('GET /todos/1 → single item', async () => {
    const res = await request(app).get('/todos/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ id: 1, text: 'Test todo' });
  });

  it('PUT /todos/1 → update item', async () => {
    const res = await request(app)
      .put('/todos/1')
      .send({ text: 'Updated todo' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ id: 1, text: 'Updated todo' });
  });

  it('DELETE /todos/1 → delete item', async () => {
    const res = await request(app).delete('/todos/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ id: 1, text: 'Updated todo' });
  });

  it('GET /todos/999 → 404 for non-existent', async () => {
    const res = await request(app).get('/todos/999');
    expect(res.statusCode).toBe(404);
  });
});
