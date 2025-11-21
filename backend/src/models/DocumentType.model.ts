import mongoose, { Document, Schema } from 'mongoose';

export interface IDocumentType extends Document {
  name: string;
  description: string;
  requiredFor?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const documentTypeSchema = new Schema<IDocumentType>(
  {
    name: {
      type: String,
      required: [true, 'Document type name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    requiredFor: {
      type: [String],
      default: [],
      validate: {
        validator: function(arr: string[]) {
          return Array.isArray(arr);
        },
        message: 'requiredFor must be an array of partner identifiers',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
documentTypeSchema.index({ name: 1 });

export const DocumentType = mongoose.model<IDocumentType>('DocumentType', documentTypeSchema);
