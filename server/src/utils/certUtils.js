import crypto from 'crypto';

/**
 * Checks if the provided buffer is non-empty and starts with '%PDF' magic bytes.
 */
export const isPdfBuffer = (buffer) => {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 4) {
    return false;
  }
  return buffer.subarray(0, 4).toString('utf-8') === '%PDF';
};

/**
 * Computes and returns the hex-encoded SHA-256 hash of a buffer.
 */
export const hashBuffer = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

/**
 * Generates a certificate ID in the format 'CERT-XXXXXX' using 6 random uppercase alphanumeric characters.
 */
export const generateCertId = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const bytes = crypto.randomBytes(6);
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return `CERT-${code}`;
};
