import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JWT token and attach authenticated issuer payload to req.issuer.
 */
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Authentication token is missing or malformed');
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.issuer = decoded;
    next();
  } catch (err) {
    const error = new Error('Invalid or expired authentication token');
    error.statusCode = 401;
    next(error);
  }
};

export default requireAuth;
