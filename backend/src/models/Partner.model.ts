import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

export interface IPartner extends Document {
  companyName: string;
  email: string;
  apiKey: string;
  apiSecret: string;
  documentTypesConfig: string[];
  isActive: boolean;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const partnerSchema = new Schema<IPartner>(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Company name must be at least 2 characters'],
      maxlength: [200, 'Company name cannot exceed 200 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    apiKey: {
      type: String,
      required: false, // Will be auto-generated in pre-save hook
      unique: true,
      select: true, // Include in queries by default for partner operations
    },
    apiSecret: {
      type: String,
      required: false, // Will be auto-generated in pre-save hook
      select: false, // Don't return secret by default for security
    },
    documentTypesConfig: {
      type: [String],
      default: [],
      validate: {
        validator: function(arr: string[]) {
          return Array.isArray(arr);
        },
        message: 'documentTypesConfig must be an array of DocumentType names',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Don't return password hash by default
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
partnerSchema.index({ companyName: 1 });
partnerSchema.index({ email: 1 });
partnerSchema.index({ apiKey: 1 });

// Generate API key and secret before saving
partnerSchema.pre('save', function(next) {
  if (this.isNew) {
    // Generate API key (readable format)
    this.apiKey = `verto_${crypto.randomBytes(16).toString('hex')}`;
    // Generate API secret (more secure)
    this.apiSecret = crypto.randomBytes(32).toString('hex');
  }
  next();
});

export const Partner = mongoose.model<IPartner>('Partner', partnerSchema);
