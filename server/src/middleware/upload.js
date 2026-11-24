import multer from 'multer';

/**
 * Multer upload middleware configured with in-memory storage.
 * Restricts upload sizes to a maximum of 5MB without ever writing to disk.
 */
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default upload;
