import mongoose, { Schema, Document } from 'mongoose';

export interface IConsentRequest extends Document {
  consentToken: string;
  partner: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  documentTypesRequested: string[];
  isGranted: boolean;
  grantedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  isExpired(): boolean;
}

const ConsentRequestSchema = new Schema<IConsentRequest>(
  {
    consentToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    partner: {
      type: Schema.Types.ObjectId,
      ref: 'Partner',
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    documentTypesRequested: [{
      type: String,
      required: true,
    }],
    isGranted: {
      type: Boolean,
      default: false,
    },
    grantedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Method to check if token is expired
ConsentRequestSchema.methods.isExpired = function(): boolean {
  return new Date() > this.expiresAt;
};

// Index for cleanup of expired tokens
ConsentRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IConsentRequest>('ConsentRequest', ConsentRequestSchema);
