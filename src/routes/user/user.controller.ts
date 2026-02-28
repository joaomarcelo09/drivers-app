import { NextFunction, Request, Response, Router } from "express";
import authMiddleware from "../../middleware/securityMiddleware";
import { getMeUser } from "../../services/user.service";
import { userResponseSchema } from "../../schemas/userSchema";

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

export default Router().use("/user", authMiddleware.required, router);
