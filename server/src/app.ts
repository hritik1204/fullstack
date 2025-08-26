import express from "express";
import helmet from "helmet";
import previewRouter from "./routes/preview.route";
import { limiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";


const app = express();

app.use(express.json());
app.use(helmet());
app.use(limiter);

app.use("/preview", previewRouter);

app.use(errorHandler); // Global error handler

export default app;
