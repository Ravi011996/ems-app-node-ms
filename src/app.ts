import express from "express";
import dotenv from "dotenv";
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import expenseRoutes from "./routes/expenseRoutes";
import globalErrorHandler from "./middlewares/errorHandlerMiddleware";
import { setupSwagger } from './swagger';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect Database
connectDB();

setupSwagger(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', expenseRoutes);

app.get("/", (req, res) => {
  res.json({ error: false, msg: "success" });
});

// Use the global error handler
app.use(globalErrorHandler);

export default app;
