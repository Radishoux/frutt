import express from 'express';
import dotenv from 'dotenv';
import articleRoutes from './routes/articleRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', articleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
