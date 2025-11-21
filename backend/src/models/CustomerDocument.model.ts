import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomerDocument extends Document {
  customer: mongoose.Types.ObjectId;
  documentType: mongoose.Types.ObjectId;
  s3Link: string;
  isVerified: boolean;
  uploadedAt: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const customerDocumentSchema = new Schema<ICustomerDocument>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer reference is required'],
      index: true,
    },
    documentType: {
      type: Schema.Types.ObjectId,
      ref: 'DocumentType',
      required: [true, 'Document type is required'],
      index: true,
    },
    s3Link: {
      type: String,
      required: [true, 'S3 link is required'],
      trim: true,
      validate: {
        validator: function(v: string) {
          // Basic S3 URL validation or placeholder
          return v.length > 0;
        },
        message: 'S3 link must be a valid string',
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'VertoAdmin',
      required: false,
    },
    verifiedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
customerDocumentSchema.index({ customer: 1, documentType: 1 });
customerDocumentSchema.index({ isVerified: 1, uploadedAt: -1 });
customerDocumentSchema.index({ documentType: 1, isVerified: 1 });

// Validation: if verified, verifiedBy and verifiedAt should exist
customerDocumentSchema.pre('save', function(next) {
  if (this.isVerified && !this.verifiedBy) {
    return next(new Error('verifiedBy is required when document is verified'));
  }
  if (this.isVerified && !this.verifiedAt) {
    this.verifiedAt = new Date();
  }
  next();
});

export const CustomerDocument = mongoose.model<ICustomerDocument>(
  'CustomerDocument',
  customerDocumentSchema
);
