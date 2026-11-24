import * as verifyService from '../services/verifyService.js';

/**
 * Handles public certificate verification via uploaded PDF file.
 */
export const handleVerifyFile = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('Certificate PDF file is required');
      error.statusCode = 400;
      throw error;
    }

    const result = await verifyService.verifyByFile(req.file.buffer);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Handles public certificate verification via certificate identifier.
 */
export const handleVerifyById = async (req, res, next) => {
  try {
    const { certId } = req.params;
    const result = await verifyService.verifyByCertId(certId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
