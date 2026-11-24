import QRCode from 'qrcode';
import { Certificate } from '../models/Certificate.js';
import { Issuer } from '../models/Issuer.js';
import { VerificationLog } from '../models/VerificationLog.js';
import { isPdfBuffer, hashBuffer, generateCertId } from '../utils/certUtils.js';
import { generateCertificatePdf } from '../utils/pdfGenerator.js';

/**
 * Issues a certificate by validating and hashing an uploaded PDF buffer in memory.
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
 * Generates an in-memory Printable Classic PDF, hashes it, registers it, and returns it.
 */
export const generateAndIssueCertificate = async ({
  studentName,
  course,
  year,
  grade,
  issuerId,
}) => {
  const issuer = await Issuer.findById(issuerId);
  const organization = issuer?.organization || 'B.M.S. College of Engineering';

  let certId = generateCertId();
  while (await Certificate.exists({ certId })) {
    certId = generateCertId();
  }

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const verifyUrl = `${clientUrl}/verify?id=${certId}`;

  const qrBuffer = await QRCode.toBuffer(verifyUrl, { width: 160, margin: 1 });
  const qrCode = await QRCode.toDataURL(verifyUrl);

  const issuedAt = new Date();
  const pdfBuffer = await generateCertificatePdf({
    studentName,
    course,
    year,
    grade,
    certId,
    issuedAt,
    organization,
    qrBuffer,
  });

  const fileHash = hashBuffer(pdfBuffer);

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

  return {
    certificate,
    qrCode,
    verifyUrl,
    pdfBase64: pdfBuffer.toString('base64'),
  };
};

/**
 * Lists certificates for a given issuer, optionally filtering by search term.
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
