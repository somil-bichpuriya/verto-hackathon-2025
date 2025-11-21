import mongoose, { Document, Schema } from 'mongoose';

export interface IVertoAdmin extends Document {
  username: string;
  passwordHash: string;
  role: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const vertoAdminSchema = new Schema<IVertoAdmin>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [50, 'Username cannot exceed 50 characters'],
      match: [/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, hyphens, and underscores'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Never return password hash by default
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['super_admin', 'admin', 'verifier', 'viewer'],
        message: 'Invalid role. Must be one of: super_admin, admin, verifier, viewer',
      },
      default: 'viewer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
vertoAdminSchema.index({ username: 1 });
vertoAdminSchema.index({ role: 1 });
vertoAdminSchema.index({ isActive: 1 });

// Instance method to check if admin can verify documents
vertoAdminSchema.methods.canVerifyDocuments = function(): boolean {
  return ['super_admin', 'admin', 'verifier'].includes(this.role);
};

export const VertoAdmin = mongoose.model<IVertoAdmin>('VertoAdmin', vertoAdminSchema);
