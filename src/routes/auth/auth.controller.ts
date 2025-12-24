import { NextFunction, Request, Response, Router } from 'express';
import { validateData } from '../../middleware/validationMiddleware';
import { userLoginSchema } from '../../schemas/userSchema';
import authMiddleware from '../../middleware/securityMiddleware';
import generateToken from '../../utils/generateToken';

const router = Router();

/**
 * Login
 * @auth none
 * @route {POST} /users/login
 * @bodyparam user User
 * @returns user User
 */
router.post('/login', validateData(userLoginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = generateToken(1);
    res.json({ response });
  } catch (error) {
    next(error);
  }
});

export default Router().use('/auth', authMiddleware.optional,router);

