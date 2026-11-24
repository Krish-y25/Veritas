import mongoose from 'mongoose';

const verificationLogSchema = new mongoose.Schema({
  certId: {
    type: String,
    default: null,
  },
  result: {
    type: String,
    enum: ['valid', 'revoked', 'not_found'],
    required: true,
  },
  method: {
    type: String,
    enum: ['file', 'id'],
    required: true,
  },
  checkedAt: {
    type: Date,
    default: Date.now,
  },
});

export const VerificationLog = mongoose.model('VerificationLog', verificationLogSchema);
