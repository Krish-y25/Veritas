import { z } from 'zod';
import * as authService from '../services/authService.js';

const loginSchema = z.object({
  email: z.string().email('A valid email address is required'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Handles issuer login request.
 */
export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData.email, validatedData.password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
