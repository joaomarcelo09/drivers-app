import * as jwt from "jsonwebtoken";

export const generateToken = (id: number, name: string): string =>
  jwt.sign({ user: { id, name } }, process.env.JWT_SECRET || "superSecret", {
    expiresIn: "24h",
  });

export const generateRefreshToken = (id: number, name: string): string =>
  jwt.sign({ user: { id, name } }, process.env.JWT_REFRESH_SECRET || "superSecret", {
    expiresIn: "7d",
  });

export const validateRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || "superSecret");
};
