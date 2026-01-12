import { NextFunction, Request, Response, Router } from 'express';
import { validateData } from '../../middleware/validationMiddleware';
import { driverRegistrationSchema, instructorRegistrationSchema, userAuthResponseSchema, userLoginSchema } from '../../schemas/userSchema';
import authMiddleware from '../../middleware/securityMiddleware';
import { generateRefreshToken, generateToken, validateRefreshToken } from '../../utils/generateToken';
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
      throw new Error('Usuário não encontrado')
    }

    if(!comparePassword(req.body.password, user.password)) {
      throw new Error('Senha incorreta')
    }

    const accessToken = generateToken(user.id, user.name);

    const refresh_token = generateRefreshToken(user.id, user.name);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/auth/refresh-token',
      maxAge: 45 * 24 * 60 * 60 * 1000,
    });

    const response = userAuthResponseSchema.parse({...user, accessToken})

    res.json({ ...response });
  } catch (error) {
    next(error);
  }
});

router.post('/register-driver', validateData(driverRegistrationSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {

    const where = {
      email: req.body.email,
    } 

    const user = await getUser(where)

    if(user) {
      throw new Error('Usuário existente com esse email')
    }

    req.body.password = await hashPassword(req.body.password)

    const data = {
      ...driverRegistrationSchema.parse(req.body),
      role: 'DRIVER' as "DRIVER" | "INSTRUCTOR"
    }

    const newUser = await createUser(data)

    const accessToken = generateToken(newUser.id, newUser.name);

    const refresh_token = generateRefreshToken(newUser.id, newUser.name);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/auth/refresh-token',
      maxAge: 45 * 24 * 60 * 60 * 1000,
    });

    const response = userAuthResponseSchema.parse({...newUser, accessToken})

    res.json({ ...response });
  } catch (error) {
    next(error);
  }
});

router.post('/register-instructor', validateData(instructorRegistrationSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {

    const where = {
      email: req.body.email,
    } 

    const user = await getUser(where)

    if(user) {
      throw new Error('Usuário existente com esse email')
    }

    req.body.password = await hashPassword(req.body.password)
    const data = {
      ...instructorRegistrationSchema.parse(req.body),
      role: 'INSTRUCTOR' as "DRIVER" | "INSTRUCTOR"
    }

    const newUser = await createUser(data)

    const accessToken = generateToken(newUser.id, newUser.name);
    const refresh_token = generateRefreshToken(newUser.id, newUser.name);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/auth/refresh-token',
      maxAge: 45 * 24 * 60 * 60 * 1000,
    });

    const response = userAuthResponseSchema.parse({...newUser, accessToken})

    res.json({ ...response });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh-token', async (req: Request, res: Response, next: NextFunction) => {
  try {

    console.log(req.cookies)

    const refresh_token = req.cookies['refresh_token'];

    if (!refresh_token) {
      throw new Error('Refresh token não encontrado');
    }

    const { id, name } = validateRefreshToken(refresh_token);

    if(!id || !name) {
      throw new Error('Refresh token inválido');
    }

    const access_token = generateToken(id, name);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/auth/refresh-token',
      maxAge: 45 * 24 * 60 * 60 * 1000,
    });

    res.json({ access_token });
  } catch (error) {
    next(error);
  }
});

export default Router().use('/auth', authMiddleware.optional, router);

