import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    certId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    grade: {
      type: String,
      required: true,
      trim: true,
    },
    fileHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    issuerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issuer',
      required: true,
    },
    status: {
      type: String,
      enum: ['valid', 'revoked'],
      default: 'valid',
    },
  },
  {
    timestamps: true,
  }
);

export const Certificate = mongoose.model('Certificate', certificateSchema);
