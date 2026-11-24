import QRCode from 'qrcode';
import { Certificate } from '../models/Certificate.js';
import { VerificationLog } from '../models/VerificationLog.js';
import { isPdfBuffer, hashBuffer, generateCertId } from '../utils/certUtils.js';

/**
 * Issues a new certificate after validating and hashing the PDF buffer in memory.
 */
export const issueCertificate = async ({
  studentName,
  course,
  year,
  grade,
  fileBuffer,
  issuerId,
}) => {
  if (!isPdfBuffer(fileBuffer)) {
    const error = new Error('Invalid file format. Uploaded file must be a valid PDF.');
    error.statusCode = 400;
    throw error;
  }

  const fileHash = hashBuffer(fileBuffer);

  const existingCert = await Certificate.findOne({ fileHash });
  if (existingCert) {
    const error = new Error('This certificate was already issued.');
    error.statusCode = 409;
    throw error;
  }

  let certId = generateCertId();
  while (await Certificate.exists({ certId })) {
    certId = generateCertId();
  }

  const certificate = await Certificate.create({
    certId,
    studentName,
    course,
    year,
    grade,
    fileHash,
    issuerId,
    status: 'valid',
  });

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verifyUrl = `${clientUrl}/verify?id=${certId}`;
  const qrCode = await QRCode.toDataURL(verifyUrl);

  return { certificate, qrCode, verifyUrl };
};

/**
 * Lists certificates for a given issuer, optionally filtering by search term across studentName, course, and certId.
 */
export const listCertificates = async ({ issuerId, search }) => {
  const query = { issuerId };

  if (search && search.trim()) {
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(escaped, 'i');
    query.$or = [
      { studentName: searchRegex },
      { course: searchRegex },
      { certId: searchRegex },
    ];
  }

  return Certificate.find(query).sort({ createdAt: -1 });
};

/**
 * Revokes a certificate belonging to the given issuer.
 */
export const revokeCertificate = async ({ id, issuerId }) => {
  const certificate = await Certificate.findOne({ _id: id, issuerId });
  if (!certificate) {
    const error = new Error('Certificate not found');
    error.statusCode = 404;
    throw error;
  }

  certificate.status = 'revoked';
  await certificate.save();

  return certificate;
};

/**
 * Retrieves aggregate statistics for the issuer.
 */
export const getStats = async (issuerId) => {
  const [totalIssued, validCount, revokedCount, totalVerifications] = await Promise.all([
    Certificate.countDocuments({ issuerId }),
    Certificate.countDocuments({ issuerId, status: 'valid' }),
    Certificate.countDocuments({ issuerId, status: 'revoked' }),
    VerificationLog.countDocuments(),
  ]);

  return {
    totalIssued,
    validCount,
    revokedCount,
    totalVerifications,
  };
};
