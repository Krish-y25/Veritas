import { z } from 'zod';
import * as certificateService from '../services/certificateService.js';

const issueSchema = z.object({
  studentName: z.string().trim().min(1, 'Student name is required'),
  course: z.string().trim().min(1, 'Course is required'),
  year: z.coerce
    .number()
    .int('Year must be an integer')
    .min(1900, 'Year must be after 1900')
    .max(2100, 'Year must be before 2100'),
  grade: z.string().trim().min(1, 'Grade is required'),
});

/**
 * Issues a new certificate.
 */
export const issue = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('Certificate PDF file is required');
      error.statusCode = 400;
      throw error;
    }

    const validatedData = issueSchema.parse(req.body);

    const result = await certificateService.issueCertificate({
      studentName: validatedData.studentName,
      course: validatedData.course,
      year: validatedData.year,
      grade: validatedData.grade,
      fileBuffer: req.file.buffer,
      issuerId: req.issuer.issuerId,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Lists certificates for the authenticated issuer.
 */
export const list = async (req, res, next) => {
  try {
    const { search } = req.query;
    const certificates = await certificateService.listCertificates({
      issuerId: req.issuer.issuerId,
      search,
    });

    res.status(200).json({ certificates });
  } catch (error) {
    next(error);
  }
};

/**
 * Revokes a certificate by ID for the authenticated issuer.
 */
export const revoke = async (req, res, next) => {
  try {
    const { id } = req.params;
    const certificate = await certificateService.revokeCertificate({
      id,
      issuerId: req.issuer.issuerId,
    });

    res.status(200).json({ certificate });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves aggregate certificate and verification statistics for the authenticated issuer.
 */
export const stats = async (req, res, next) => {
  try {
    const statsData = await certificateService.getStats(req.issuer.issuerId);
    res.status(200).json(statsData);
  } catch (error) {
    next(error);
  }
};
