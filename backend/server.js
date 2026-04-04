import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import dashboardRoutes from './routes/dashboard.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: true,   // allow all origins
  credentials: true
}));


// Middleware
app.use(express.json());


// Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);


// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);

  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
  });
});


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));


// Server Start
const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});