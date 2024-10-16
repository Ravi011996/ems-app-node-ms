import express from "express";
import dotenv from "dotenv";
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import expenseRoutes from "./routes/expenseRoutes";
import globalErrorHandler from "./middlewares/errorHandlerMiddleware";
import { setupSwagger } from './swagger';

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

setupSwagger(app);

app.use('/api/auth', authRoutes);
app.use('/api', expenseRoutes);

app.get("/", (req, res) => {
  res.json({ error: false, msg: "success" });
});

app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
