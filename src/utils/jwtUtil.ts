// utils/jwtUtil.ts
import jwt from "jsonwebtoken";

export const verifyToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        reject("Token is not valid");
      } else {
        resolve(decoded);
      }
    });
  });
};
