import express from "express";
import cors from "cors";
import routes from "./routes/routes";
import HttpException from "./models/http-exception.model";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

const app = express();

/**
 * App Configuration
 */

app.use(
  cors({
    origin: ["http://localhost:5173", "https://condutores.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));

// Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(routes);

// Serves images
app.use(express.static(__dirname + "/assets"));

app.get("/", (req: express.Request, res: express.Response) => {
  res.json({ status: "API is running on /api" });
});

/* eslint-disable */
app.use((err: Error | HttpException, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // @ts-ignore
  if (err && err.name === "UnauthorizedError") {
    return res.status(401).json({
      status: "error",
      error: "missing authorization credentials",
    });
    // @ts-ignore
  } else if (err && err.errorCode) {
    // @ts-ignore
    const status = err.errorCode;
    // @ts-ignore
    const message = err.message;
    // Handle object format { error: "..." } or string format
    if (typeof message === "object" && message !== null && "error" in message) {
      res.status(status).json(message);
    } else if (typeof message === "object" && message !== null) {
      res.status(status).json(message);
    } else {
      res.status(status).json({ error: message });
    }
  } else if (err) {
    res.status(500).json(err.message);
  }
});

/**
 * Server activation
 */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.info(`server up on port ${PORT}`);
});
