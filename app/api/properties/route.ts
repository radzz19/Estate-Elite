import { NextRequest, NextResponse } from 'next/server';
import { getAllProperties, addProperty, uploadMultipleToCloudinary, deleteProperty, updateProperty, searchProperties } from '@/lib/properties';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const type = searchParams.get('type') as 'sale' | 'rent' | null;
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const location = searchParams.get('location');
    const bedrooms = searchParams.get('bedrooms');
    const bathrooms = searchParams.get('bathrooms');

    // If any search parameters are provided, use search function
    if (search || type || minPrice || maxPrice || location || bedrooms || bathrooms) {
      const query = {
        ...(search && { search }),
        ...(type && { type }),
        ...(minPrice && { minPrice: parseInt(minPrice) }),
        ...(maxPrice && { maxPrice: parseInt(maxPrice) }),
        ...(location && { location }),
        ...(bedrooms && { bedrooms: parseInt(bedrooms) }),
        ...(bathrooms && { bathrooms: parseInt(bathrooms) }),
      };
      
      const properties = await searchProperties(query);
      return NextResponse.json(properties);
    }

    // Otherwise, get all properties
    const properties = await getAllProperties();
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Get properties error:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const propertyData = JSON.parse(formData.get('data') as string);

    // Handle multiple images
    const imageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image') && value instanceof File) {
        imageFiles.push(value);
      }
    }

    let imageUrls: string[] = [];

    if (imageFiles.length > 0) {
      try {
        // Check if Cloudinary is properly configured
        const isCloudinaryConfigured = 
          process.env.CLOUDINARY_CLOUD_NAME && 
          process.env.CLOUDINARY_API_KEY && 
          process.env.CLOUDINARY_API_SECRET &&
          process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name' &&
          process.env.CLOUDINARY_API_KEY !== 'your-api-key';

        if (isCloudinaryConfigured) {
          // Convert files to base64 for Cloudinary
          const base64Images = await Promise.all(
            imageFiles.map(async (file) => {
              const bytes = await file.arrayBuffer();
              const buffer = Buffer.from(bytes);
              return `data:${file.type};base64,${buffer.toString('base64')}`;
            })
          );

          const uploadResults = await uploadMultipleToCloudinary(base64Images);
          imageUrls = uploadResults.map(result => result.url);
        } else {
          // Use placeholder images if Cloudinary is not configured
          console.warn('Cloudinary not configured, using placeholder images');
          imageUrls = imageFiles.map((_, index) => 
            `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&auto=format&sig=${index}`
          );
        }
      } catch (error) {
        console.error('Image upload error:', error);
        // Use placeholder images if upload fails
        imageUrls = imageFiles.map((_, index) => 
          `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&auto=format&sig=${index}`
        );
      }
    } else {
      // Use placeholder if no images provided
      imageUrls = [`https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&auto=format`];
    }

    const newProperty = await addProperty({
      ...propertyData,
      images: imageUrls,
      amenities: Array.isArray(propertyData.amenities) 
        ? propertyData.amenities 
        : propertyData.amenities?.split(',').map((f: string) => f.trim()) || []
    });

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error('Add property error:', error);
    return NextResponse.json({ error: 'Failed to add property' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const formData = await request.formData();
    const propertyData = JSON.parse(formData.get('data') as string);

    // Handle new images if any
    const imageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image') && value instanceof File) {
        imageFiles.push(value);
      }
    }

    let newImageUrls: string[] = [];

    if (imageFiles.length > 0) {
      try {
        const base64Images = await Promise.all(
          imageFiles.map(async (file) => {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            return `data:${file.type};base64,${buffer.toString('base64')}`;
          })
        );

        const uploadResults = await uploadMultipleToCloudinary(base64Images);
        newImageUrls = uploadResults.map(result => result.url);
      } catch (error) {
        console.error('Image upload error:', error);
      }
    }

    // Combine existing images with new ones
    const updatedImages = [...(propertyData.existingImages || []), ...newImageUrls];

    const updatedProperty = await updateProperty(id, {
      ...propertyData,
      images: updatedImages,
      amenities: Array.isArray(propertyData.amenities) 
        ? propertyData.amenities 
        : propertyData.amenities?.split(',').map((f: string) => f.trim()) || []
    });

    if (!updatedProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error('Update property error:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const deletedProperty = await deleteProperty(id);
    
    if (!deletedProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
