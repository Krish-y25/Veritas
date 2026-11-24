import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { verifyLimiter } from '../middleware/rateLimiter.js';
import { handleVerifyFile, handleVerifyById } from '../controllers/verifyController.js';

const router = Router();

// POST /api/verify/file (public, rate limited, multipart)
router.post('/file', verifyLimiter, upload.single('file'), handleVerifyFile);

// GET /api/verify/:certId (public)
router.get('/:certId', handleVerifyById);

export default router;
