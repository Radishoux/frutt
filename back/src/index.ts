import express from 'express';
import dotenv from 'dotenv';
import articleRoutes from './routes/articleRoutes';
import pool from './config/db';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', articleRoutes);

pool.getConnection()
  .then(connection => {
    console.log('Connected to the MySQL database.');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the MySQL database:', err.message);
  });


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


