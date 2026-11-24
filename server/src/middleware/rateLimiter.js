import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for public verification endpoints.
 * Restricts each IP to 30 requests per 15-minute window.
 */
export const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many verification requests. Please try again later.',
    });
  },
});

export default verifyLimiter;
