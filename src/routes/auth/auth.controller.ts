import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

/**
 * Login
 * @auth none
 * @route {POST} /users/login
 * @bodyparam user User
 * @returns user User
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = 'digitei aqui'
    res.json({ response });
  } catch (error) {
    next(error);
  }
});

export default Router().use('/auth', router);

