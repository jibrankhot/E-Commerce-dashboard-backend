import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './src/routes/auth.routes';
import productRoutes from './src/routes/product.routes';
import { requireAdmin } from './src/middlewares/auth.middleware';

const app = express();

// ==============================
// Middleware
// ==============================
app.use(cors());
app.use(express.json());

// ==============================
// Routes
// ==============================
app.use('/auth', authRoutes);
app.use('/admin/products', productRoutes);

app.get('/admin/secure', requireAdmin, (_req, res) => {
    res.json({ message: 'Admin access granted' });
});

// ==============================
// Health
// ==============================
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==============================
// Bootstrap
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
