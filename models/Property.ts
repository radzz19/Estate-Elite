import mongoose from 'mongoose';

export interface IProperty {
  _id?: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[]; // Array of Cloudinary URLs
  type: 'sale' | 'rent';
  bedrooms?: number;
  bathrooms?: number;
  area?: number; // in square feet
  amenities?: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const PropertySchema = new mongoose.Schema<IProperty>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String,
    required: true
  }],
  type: {
    type: String,
    enum: ['sale', 'rent'],
    required: true
  },
  bedrooms: {
    type: Number,
    min: 0
  },
  bathrooms: {
    type: Number,
    min: 0
  },
  area: {
    type: Number,
    min: 0
  },
  amenities: [{
    type: String,
    trim: true
  }],
  contact: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    }
  }
}, {
  timestamps: true
});

// Create index for better search performance
PropertySchema.index({ title: 'text', description: 'text', location: 'text' });
PropertySchema.index({ type: 1, price: 1 });
PropertySchema.index({ location: 1 });

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
