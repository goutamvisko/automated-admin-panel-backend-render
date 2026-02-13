import userRoutes from './adminRoutes/userRoutes.js';
import authRoutes from './adminRoutes/authRoutes.js';
import express from 'express';
const app = express();

app.use('/user', userRoutes);
app.use('/user/authModule', authRoutes);

export default app;