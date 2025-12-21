import dotenv from 'dotenv';
dotenv.config(); // ✅ MUST BE FIRST

import express from 'express';
import cors from 'cors';
import path from 'path';

/**
 * Route imports (based on your folder structure)
 */
import authRoutes from './src/modules/auth/auth.routes';
import userRoutes from './src/modules/users/user.routes';
import productRoutes from './src/modules/products/product.routes';
import categoryRoutes from './src/modules/categories/categories.routes';
import orderRoutes from './src/modules/orders/order.routes';
import paymentRoutes from './src/modules/payment/payment.routes';

const app = express();

/**
 * Global Middleware
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Serve uploaded images (dev only)
 */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

/**
 * Health check
 */
app.get('/', (_req, res) => {
    res.send('Admin API is running');
});

/**
 * Start server
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
