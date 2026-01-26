import { NextFunction, Request, Response, Router } from "express";
import { validateData } from "../../middleware/validationMiddleware";
import {
  driverRegistrationSchema,
  instructorRegistrationSchema,
  userAuthResponseSchema,
  userLoginSchema,
} from "../../schemas/userSchema";
import authMiddleware from "../../middleware/securityMiddleware";
import {
  generateRefreshToken,
  generateToken,
  validateRefreshToken,
} from "../../utils/generateToken";
import { createUser, getUser } from "../../services/user.service";
import { comparePassword, hashPassword } from "../../utils/bcrypt";
import { BAD_REQUEST } from "http-status-codes";
import HttpException from "../../models/http-exception.model";

const router = Router();
const isProduction = process.env.NODE_ENV === "production";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and registration endpoints
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: Refresh token cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  validateData(userLoginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await getUser({ email: req.body.email });

      if (!user) {
        throw new HttpException(BAD_REQUEST, "Usuário inexistente");
      }

      const passwordMatch = await comparePassword(
        req.body.password,
        user.password,
      );

      if (!passwordMatch) {
        throw new HttpException(BAD_REQUEST, "Senha incorreta");
      }

      const accessToken = generateToken(user.id, user.name);
      const refresh_token = generateRefreshToken(user.id, user.name);

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "none",
        path: "/",
        maxAge: 45 * 24 * 60 * 60 * 1000,
      });

      const response = userAuthResponseSchema.parse({
        ...user,
        accessToken,
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /api/auth/register-driver:
 *   post:
 *     summary: Register a new driver
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Driver
 *               email:
 *                 type: string
 *                 format: email
 *                 example: driver@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Driver registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                   example: DRIVER
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: User already exists
 */
router.post(
  "/register-driver",
  validateData(driverRegistrationSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existingUser = await getUser({ email: req.body.email });

      if (existingUser) {
        throw new HttpException(
          BAD_REQUEST,
          "Usuário existente com esse email",
        );
      }

      req.body.password = await hashPassword(req.body.password);

      const newUser = await createUser({
        ...driverRegistrationSchema.parse(req.body),
        role: "DRIVER",
      });

      const accessToken = generateToken(newUser.id, newUser.name);
      const refresh_token = generateRefreshToken(newUser.id, newUser.name);

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "none",
        path: "/",
        maxAge: 45 * 24 * 60 * 60 * 1000,
      });

      const response = userAuthResponseSchema.parse({
        ...newUser,
        accessToken,
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /api/auth/register-instructor:
 *   post:
 *     summary: Register a new instructor
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Instructor
 *               email:
 *                 type: string
 *                 format: email
 *                 example: instructor@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Instructor registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                   example: INSTRUCTOR
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: User already exists
 */
router.post(
  "/register-instructor",
  validateData(instructorRegistrationSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existingUser = await getUser({ email: req.body.email });

      if (existingUser) {
        throw new HttpException(
          BAD_REQUEST,
          "Usuário existente com esse email",
        );
      }

      req.body.password = await hashPassword(req.body.password);

      const newUser = await createUser({
        ...instructorRegistrationSchema.parse(req.body),
        role: "INSTRUCTOR",
      });

      const accessToken = generateToken(newUser.id, newUser.name);
      const refresh_token = generateRefreshToken(newUser.id, newUser.name);

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "none",
        path: "/",
        maxAge: 45 * 24 * 60 * 60 * 1000,
      });

      const response = userAuthResponseSchema.parse({
        ...newUser,
        accessToken,
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   get:
 *     summary: Generate a new access token using refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New access token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Refresh token missing or invalid
 */
router.get(
  "/refresh-token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token;

      if (!refresh_token) {
        throw new Error("Refresh token não encontrado");
      }

      const { user } = validateRefreshToken(refresh_token);

      if (!user?.id || !user?.name) {
        throw new Error("Refresh token inválido");
      }

      const access_token = generateToken(user.id, user.name);

      res.json(access_token);
    } catch (error) {
      next(error);
    }
  },
);

export default Router().use("/auth", authMiddleware.optional, router);
