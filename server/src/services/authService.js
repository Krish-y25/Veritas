import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Issuer } from '../models/Issuer.js';

/**
 * Authenticates an issuer by email and password, returning a signed JWT.
 */
export const login = async (email, password) => {
  const issuer = await Issuer.findOne({ email: email.toLowerCase().trim() });
  if (!issuer) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, issuer.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const payload = {
    issuerId: issuer._id.toString(),
    email: issuer.email,
    name: issuer.name,
    organization: issuer.organization,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  return {
    token,
    issuer: {
      id: issuer._id.toString(),
      name: issuer.name,
      email: issuer.email,
      organization: issuer.organization,
    },
  };
};
