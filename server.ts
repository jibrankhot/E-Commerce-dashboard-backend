import dotenv from 'dotenv';
dotenv.config(); // ✅ MUST BE FIRST

import express from 'express';
import cors from 'cors';
import path from 'path';

import routes from './src/routes';

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
app.use(
    '/uploads',
    express.static(path.join(__dirname, 'uploads'))
);

/**
 * API Routes
 */
app.use('/api', routes);

/**
 * Health check
 */
app.get('/', (_req, res) => {
    res.send('Admin API is running');
});

/**
 * Start server
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
