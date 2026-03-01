import { NextFunction, Request, Response, Router } from "express";
import authMiddleware from "../../middleware/securityMiddleware";
import { getMeUser, updateUser } from "../../services/user.service";
import { userResponseSchema, updateUserSchema } from "../../schemas/userSchema";

const router = Router();

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
router.get("/me", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const userId = req.auth?.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await getMeUser(userId);
    const response = userResponseSchema.parse(user);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/user/me:
 *   put:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               telephone:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *               driver:
 *                 type: object
 *                 properties:
 *                   active:
 *                     type: boolean
 *               instructor:
 *                 type: object
 *                 properties:
 *                   priceHour:
 *                     type: number
 *                   bio:
 *                     type: string
 *                   active:
 *                     type: boolean
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *     responses:
 *       200:
 *         description: User updated
 *       401:
 *         description: Unauthorized
 */
router.put("/me", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const userId = req.auth?.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = updateUserSchema.parse(req.body);

    const user = await updateUser(
      userId,
      {
        name: data.name,
        telephone: data.telephone,
        city: data.city,
        state: data.state,
        gender: data.gender,
      },
      data.driver,
      data.instructor,
    );

    const response = userResponseSchema.parse(user);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default Router().use("/user", authMiddleware.required, router);
