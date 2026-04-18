import jwt from "jsonwebtoken";

export const generateToken = ({ payload, secret , options = {} } = {}) => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = ({ token, secret, options = {} } = {}) => {
  return jwt.verify(token, secret, options);
};
