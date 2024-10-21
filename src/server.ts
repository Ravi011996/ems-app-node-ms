import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { authRoute, expenseRoute } from './routes/index';
import globalErrorHandler from './middlewares/errorHandlerMiddleware';
import { setupSwagger } from './swagger';

dotenv.config();

const app = express();

app.use(express.json());

setupSwagger(app);

app.use('/api/auth', authRoute);
app.use('/api', expenseRoute);

app.get('/', (req, res) => {
  res.json({ error: false, msg: 'success' });
});

app.use(globalErrorHandler);

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
