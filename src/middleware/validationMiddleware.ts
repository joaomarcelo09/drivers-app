import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

import { StatusCodes } from "http-status-codes";

export function validateData(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        res.status(StatusCodes.BAD_REQUEST).json({
          code: "VALIDATION_ERROR",
          message: "Corpo da requisição inválido",
          details,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          code: "INTERNAL_ERROR",
          message: "Erro interno do servidor",
        });
      }
    }
  };
}
