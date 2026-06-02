import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import profileRoutes from './routes/profiles.js';
import generateRoutes from './routes/generate.js';
import atsRoutes from './routes/ats.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/profiles', profileRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/ats', atsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'AI Resume Builder API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});