import express, { Request, Response } from "express";
import cors from "cors";
import route from "./routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", route);

app.use("/", (_req: Request, res: Response) => {
  res.send("<b>WELCOME TO MY BACKEND WEBSITE!</b>");
});

// Error handling middleware
app.use(errorHandler);

export default app;
