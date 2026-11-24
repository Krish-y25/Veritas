import { Certificate } from '../models/Certificate.js';
import { VerificationLog } from '../models/VerificationLog.js';
import { isPdfBuffer, hashBuffer } from '../utils/certUtils.js';

/**
 * Helper to format the certificate object for client consumption.
 */
const formatCertificate = (cert) => {
  if (!cert) return null;
  return {
    certId: cert.certId,
    studentName: cert.studentName,
    course: cert.course,
    year: cert.year,
    grade: cert.grade,
    fileHash: cert.fileHash,
    status: cert.status,
    issuedAt: cert.createdAt,
    issuer: cert.issuerId,
  };
};

/**
 * Verifies certificate authenticity using the uploaded PDF buffer.
 * Hashes buffer in memory; never saves the file to disk or database.
 */
export const verifyByFile = async (fileBuffer) => {
  if (!isPdfBuffer(fileBuffer)) {
    const error = new Error('Please upload a valid PDF file.');
    error.statusCode = 400;
    throw error;
  }

  const computedHash = hashBuffer(fileBuffer);
  const cert = await Certificate.findOne({ fileHash: computedHash }).populate(
    'issuerId',
    'name organization'
  );

  let result = 'not_found';
  let message = 'This file was not issued through Veritas, or it was changed after issuing.';

  if (cert) {
    if (cert.status === 'revoked') {
      result = 'revoked';
      message = 'This certificate has been revoked by the issuer.';
    } else {
      result = 'valid';
      message = 'Certificate is authentic and valid.';
    }
  }

  // Log verification attempt
  await VerificationLog.create({
    certId: cert ? cert.certId : null,
    result,
    method: 'file',
  });

  return {
    status: result,
    computedHash,
    message,
    certificate: formatCertificate(cert),
  };
};

/**
 * Verifies certificate authenticity using the certificate identifier (certId).
 */
export const verifyByCertId = async (certId) => {
  const normalizedId = (certId || '').trim().toUpperCase();

  const cert = await Certificate.findOne({ certId: normalizedId }).populate(
    'issuerId',
    'name organization'
  );

  let result = 'not_found';
  let message = `No certificate found with ID: ${normalizedId}`;

  if (cert) {
    if (cert.status === 'revoked') {
      result = 'revoked';
      message = 'This certificate has been revoked by the issuer.';
    } else {
      result = 'valid';
      message = 'Certificate is authentic and valid.';
    }
  }

  // Log verification attempt
  await VerificationLog.create({
    certId: cert ? cert.certId : normalizedId,
    result,
    method: 'id',
  });

  return {
    status: result,
    message,
    certificate: formatCertificate(cert),
  };
};
