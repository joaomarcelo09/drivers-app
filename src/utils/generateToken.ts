import * as jwt from 'jsonwebtoken';

const generateToken = (id: number, name: string): string =>
  jwt.sign({ user: { id, name } }, process.env.JWT_SECRET || 'superSecret', {
    expiresIn: '60d',
  });

export default generateToken;
