import { NextFunction, Request, Response, Router } from 'express';
import { validateData } from '../../middleware/validationMiddleware';
import { driverRegistrationSchema, instructorRegistrationSchema, userAuthResponseSchema, userLoginSchema } from '../../schemas/userSchema';
import authMiddleware from '../../middleware/securityMiddleware';
import generateToken from '../../utils/generateToken';
import { createUser, getUser } from '../../services/user.service';
import { comparePassword, hashPassword } from '../../utils/bcrypt';

const router = Router();

router.post('/login', validateData(userLoginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {

    const where = {
      email: req.body.email,
    } 

    const user = await getUser(where)

    if(!user) {
      throw new Error('User not found')
    }

    if(!comparePassword(req.body.password, user.password)) {
      throw new Error('Invalid password')
    }

    const accessToken = generateToken(user.id, user.name);
    const response = userAuthResponseSchema.parse({...user, accessToken})

    res.json({ ...response });
  } catch (error) {
    next(error);
  }
});

router.post('/register-driver', validateData(driverRegistrationSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {

    req.body.password = await hashPassword(req.body.password)

    const data = {
      ...driverRegistrationSchema.parse(req.body),
      role: 'DRIVER' as "DRIVER" | "INSTRUCTOR"
    }

    const newUser = await createUser(data)

    const accessToken = generateToken(newUser.id, newUser.name);

    const response = userAuthResponseSchema.parse({...newUser, accessToken})

    res.json({ ...response });
  } catch (error) {
    next(error);
  }
});

router.post('/register-instructor', validateData(instructorRegistrationSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {

    req.body.password = await hashPassword(req.body.password)
    const data = {
      ...instructorRegistrationSchema.parse(req.body),
      role: 'INSTRUCTOR' as "DRIVER" | "INSTRUCTOR"
    }

    const newUser = await createUser(data)

    const accessToken = generateToken(newUser.id, newUser.name);

    const response = userAuthResponseSchema.parse({...newUser, accessToken})

    res.json({ ...response });
  } catch (error) {
    next(error);
  }
});

export default Router().use('/auth', authMiddleware.optional, router);

