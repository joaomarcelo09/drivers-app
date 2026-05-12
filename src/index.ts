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
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      ...(err.details !== undefined && { details: err.details }),
    });
  }

  // express-jwt unauthorized errors
  // @ts-ignore
  if (err?.name === "UnauthorizedError") {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Credenciais de autorização ausentes",
    });
  }

  // Unexpected server errors — do not leak internal details to the client
  console.error("[INTERNAL_ERROR]", err);
  return res.status(500).json({
    code: "INTERNAL_ERROR",
    message: "Erro interno do servidor",
  });
});

/**
 * Server activation
 */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.info(`server up on port ${PORT}`);
});
