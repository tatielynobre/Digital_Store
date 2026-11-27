import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) =>
  res.status(200).json({
    name: 'Digital Store API',
    status: 'running',
    endpoints: {
      health: '/health',
      users: '/v1/user',
      categories: '/v1/category',
      products: '/v1/product',
    },
  }),
);
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/v1/user', userRoutes);
app.use('/v1/category', categoryRoutes);
app.use('/v1/product', productRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  return res.status(500).json({ error: 'Internal server error' });
});

export default app;
