import request from 'supertest';
import app from '../src/app.js';
import { sequelize, User, Category, Product } from '../src/models/index.js';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test('creates a user, generates a token and validates protected category routes', async () => {
  const root = await request(app).get('/');
  expect(root.status).toBe(200);
  expect(root.body.name).toBe('Digital Store API');

  const created = await request(app).post('/v1/user').send({
    firstname: 'Ana',
    surname: 'Silva',
    email: 'ana@example.com',
    password: '123@123',
    confirmPassword: '123@123',
  });
  expect(created.status).toBe(201);
  expect(created.body).not.toHaveProperty('password');

  const unauthenticated = await request(app).post('/v1/category').send({
    name: 'Shoes',
    slug: 'shoes',
  });
  expect(unauthenticated.status).toBe(400);

  const login = await request(app).post('/v1/user/token').send({
    email: 'ana@example.com',
    password: '123@123',
  });
  expect(login.status).toBe(200);
  expect(login.body.token).toBeTruthy();

  const category = await request(app)
    .post('/v1/category')
    .set('Authorization', `Bearer ${login.body.token}`)
    .send({ name: 'Shoes', slug: 'shoes', use_in_menu: true });
  expect(category.status).toBe(201);
  expect(category.body.use_in_menu).toBe(true);

  const search = await request(app).get('/v1/category/search?limit=-1&use_in_menu=true');
  expect(search.status).toBe(200);
  expect(search.body.data).toHaveLength(1);
});

test('creates and retrieves a product with categories, images and options', async () => {
  const category = await Category.create({ name: 'Offers', slug: 'offers', use_in_menu: true });
  const user = await User.findOne({ where: { email: 'ana@example.com' } });
  const login = await request(app).post('/v1/user/token').send({
    email: 'ana@example.com',
    password: '123@123',
  });

  const created = await request(app)
    .post('/v1/product')
    .set('Authorization', `Bearer ${login.body.token}`)
    .send({
      enabled: true,
      name: 'Tenis',
      slug: 'tenis',
      stock: 10,
      description: 'Tenis esportivo',
      price: 119.9,
      price_with_discount: 99.9,
      category_ids: [category.id],
      images: [{ type: 'image/png', content: 'base64-image' }],
      options: [{ title: 'Tamanho', shape: 'square', type: 'text', values: ['PP', 'GG'] }],
    });
  expect(created.status).toBe(201);
  expect(created.body.category_ids).toEqual([category.id]);
  expect(created.body.images).toHaveLength(1);
  expect(created.body.options).toHaveLength(1);

  const retrieved = await request(app).get(`/v1/product/${created.body.id}`);
  expect(retrieved.status).toBe(200);
  expect(retrieved.body.name).toBe('Tenis');

  const filtered = await request(app).get('/v1/product/search?match=Tenis&category_ids=' + category.id);
  expect(filtered.status).toBe(200);
  expect(filtered.body.total).toBe(1);
});
