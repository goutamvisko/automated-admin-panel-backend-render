import authRoutes from './adminRoutes/authRoutes.js';
import express from 'express';
const app = express();

app.use('/user/auth', authRoutes);

export default app;