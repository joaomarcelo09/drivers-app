import { NextFunction, Request, Response, Router } from 'express';
import { createUser } from '../../services/user.service';
import { validateData } from '../../middleware/validationMiddleware';
import { userLoginSchema } from '../../schemas/userSchema';

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
    const response = await createUser();
    res.json({ response });
  } catch (error) {
    next(error);
  }
});

export default Router().use('/auth', router);

