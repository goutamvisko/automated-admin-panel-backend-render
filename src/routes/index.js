import userRoutes from './adminRoutes/userRoutes.js';
import authRoutes from './adminRoutes/authRoutes.js';
import planRoutes from './paymentRoutes/planRoutes.js';

import express from 'express';
const app = express();

app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/plans', planRoutes);

export default app;