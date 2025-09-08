import { NextRequest, NextResponse } from 'next/server';
import { deleteProperty, getPropertyById } from '@/lib/properties';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await getPropertyById(id);
    
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    
    return NextResponse.json(property);
  } catch (error) {
    console.error('Get property by ID error:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    console.log('Admin attempting to delete property:', id);
    
    const deletedProperty = await deleteProperty(id);

    if (!deletedProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    console.log('Property successfully deleted:', id);
    return NextResponse.json({ 
      success: true, 
      message: 'Property and associated images deleted successfully',
      deletedProperty: {
        id: deletedProperty.id,
        title: deletedProperty.title,
        imageCount: deletedProperty.images.length
      }
    });
  } catch (error) {
    console.error('Delete property error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete property',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
