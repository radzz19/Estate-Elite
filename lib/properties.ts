import { v2 as cloudinary } from 'cloudinary';
import connectDB from './mongodb';
import Property, { IProperty } from '../models/Property';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'LnOLrNArVrDru3fgUJ5Tv2FSDsM'
});

export interface PropertyType {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  type: 'sale' | 'rent';
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  amenities?: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
  cloudinaryPublicIds?: string[];
}

// Helper function to convert MongoDB document to PropertyType
function convertToPropertyType(doc: any): PropertyType {
  return {
    id: doc._id?.toString() || '',
    title: doc.title,
    description: doc.description,
    price: doc.price,
    location: doc.location,
    images: doc.images || [],
    type: doc.type,
    bedrooms: doc.bedrooms,
    bathrooms: doc.bathrooms,
    area: doc.area,
    amenities: doc.amenities || [],
    contact: doc.contact,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

export async function uploadToCloudinary(file: string): Promise<{ url: string; publicId: string }> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'estate-elite-properties',
      transformation: [
        { width: 1200, height: 800, crop: 'fill' },
        { quality: 'auto' },
        { format: 'webp' }
      ]
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
}

export async function uploadMultipleToCloudinary(files: string[]): Promise<{ url: string; publicId: string }[]> {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw new Error('Failed to upload images');
  }
}

// Test function to verify Cloudinary configuration
export async function testCloudinaryConnection(): Promise<boolean> {
  try {
    console.log('Testing Cloudinary connection...');
    const result = await cloudinary.api.ping();
    console.log('Cloudinary ping result:', result);
    return result.status === 'ok';
  } catch (error) {
    console.error('Cloudinary connection test failed:', error);
    return false;
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    console.log('Attempting to delete from Cloudinary:', publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary deletion result:', result);
    
    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new Error(`Cloudinary deletion failed: ${result.result}`);
    }
  } catch (error) {
    console.error('Cloudinary delete error for public ID:', publicId, error);
    throw error;
  }
}

export async function deleteMultipleFromCloudinary(publicIds: string[]): Promise<void> {
  try {
    console.log('Deleting multiple images from Cloudinary:', publicIds);
    const deletePromises = publicIds.map(async (id) => {
      try {
        await deleteFromCloudinary(id);
        return { id, success: true };
      } catch (error) {
        console.error(`Failed to delete ${id}:`, error);
        return { id, success: false, error };
      }
    });
    
    const results = await Promise.all(deletePromises);
    const failures = results.filter(r => !r.success);
    
    if (failures.length > 0) {
      console.warn('Some images failed to delete:', failures);
    }
    
    console.log('Cloudinary deletion summary:', {
      total: publicIds.length,
      succeeded: results.filter(r => r.success).length,
      failed: failures.length
    });
  } catch (error) {
    console.error('Multiple delete error:', error);
    throw new Error('Failed to delete some images');
  }
}

export async function getAllProperties(): Promise<PropertyType[]> {
  try {
    await connectDB();
    const properties: any[] = await Property.find({}).sort({ createdAt: -1 }).lean();
    return properties.map(convertToPropertyType);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

export async function getPropertyById(id: string): Promise<PropertyType | null> {
  try {
    await connectDB();
    const property: any = await Property.findById(id).lean();
    return property ? convertToPropertyType(property) : null;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

export async function addProperty(propertyData: {
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  type: 'sale' | 'rent';
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  amenities?: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
}): Promise<PropertyType> {
  try {
    await connectDB();
    const newProperty = new Property(propertyData);
    const savedProperty = await newProperty.save();
    return convertToPropertyType(savedProperty.toObject());
  } catch (error) {
    console.error('Error adding property:', error);
    throw new Error('Failed to add property');
  }
}

export async function updateProperty(id: string, propertyData: Partial<PropertyType>): Promise<PropertyType | null> {
  try {
    await connectDB();
    const updatedProperty: any = await Property.findByIdAndUpdate(
      id,
      { ...propertyData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
    return updatedProperty ? convertToPropertyType(updatedProperty) : null;
  } catch (error) {
    console.error('Error updating property:', error);
    throw new Error('Failed to update property');
  }
}

export async function deleteProperty(id: string): Promise<PropertyType | null> {
  try {
    await connectDB();
    const property: any = await Property.findById(id).lean();
    if (!property) return null;

    // Delete images from Cloudinary
    if (property.images && property.images.length > 0) {
      console.log('Deleting images from Cloudinary for property:', id);
      console.log('Image URLs:', property.images);
      
      const publicIds = property.images.map((url: string) => {
        try {
          // Extract public ID from Cloudinary URL
          // URL format: https://res.cloudinary.com/[cloud-name]/image/upload/[version]/[folder]/[filename]
          const urlParts = url.split('/');
          const uploadIndex = urlParts.findIndex(part => part === 'upload');
          
          if (uploadIndex === -1) {
            console.warn('Invalid Cloudinary URL format:', url);
            return null;
          }
          
          // Get everything after 'upload' and optional version number
          let pathAfterUpload = urlParts.slice(uploadIndex + 1);
          
          // Skip version number if present (starts with 'v' followed by numbers)
          if (pathAfterUpload[0] && /^v\d+$/.test(pathAfterUpload[0])) {
            pathAfterUpload = pathAfterUpload.slice(1);
          }
          
          // Join the remaining parts and remove file extension
          const publicId = pathAfterUpload.join('/').replace(/\.[^/.]+$/, '');
          console.log('Extracted public ID:', publicId, 'from URL:', url);
          return publicId;
        } catch (error) {
          console.error('Error extracting public ID from URL:', url, error);
          return null;
        }
      }).filter(Boolean); // Remove null values
      
      if (publicIds.length > 0) {
        try {
          console.log('Deleting public IDs from Cloudinary:', publicIds);
          await deleteMultipleFromCloudinary(publicIds);
          console.log('Successfully deleted images from Cloudinary');
        } catch (error) {
          console.error('Failed to delete images from Cloudinary:', error);
          // Continue with property deletion even if Cloudinary deletion fails
        }
      } else {
        console.warn('No valid public IDs found for deletion');
      }
    }

    // Delete the property from database
    const deletedProperty: any = await Property.findByIdAndDelete(id).lean();
    console.log('Property deleted from database:', id);
    return deletedProperty ? convertToPropertyType(deletedProperty) : null;
  } catch (error) {
    console.error('Error deleting property:', error);
    throw new Error('Failed to delete property');
  }
}

export async function searchProperties(query: {
  search?: string;
  type?: 'sale' | 'rent';
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
}): Promise<PropertyType[]> {
  try {
    await connectDB();
    
    const filter: any = {};
    
    if (query.search) {
      filter.$text = { $search: query.search };
    }
    
    if (query.type) {
      filter.type = query.type;
    }
    
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = query.minPrice;
      if (query.maxPrice) filter.price.$lte = query.maxPrice;
    }
    
    if (query.location) {
      filter.location = new RegExp(query.location, 'i');
    }
    
    if (query.bedrooms) {
      filter.bedrooms = query.bedrooms;
    }
    
    if (query.bathrooms) {
      filter.bathrooms = query.bathrooms;
    }
    
    const properties: any[] = await Property.find(filter).sort({ createdAt: -1 }).lean();
    return properties.map(convertToPropertyType);
  } catch (error) {
    console.error('Error searching properties:', error);
    return [];
  }
}
