import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { issue, generate, list, revoke } from '../controllers/certificateController.js';

const router = Router();

// POST /api/certificates (multipart, auth)
router.post('/', upload.single('file'), issue);

// POST /api/certificates/generate (json, auth)
router.post('/generate', generate);

// GET /api/certificates (auth, search)
router.get('/', list);

// PATCH /api/certificates/:id/revoke (auth)
router.patch('/:id/revoke', revoke);

export default router;
