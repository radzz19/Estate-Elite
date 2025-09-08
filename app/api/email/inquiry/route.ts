import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message, propertyTitle } = await request.json();

    // Here you would typically send an email using your preferred email service
    // For now, we'll just log the inquiry and return success
    console.log('New inquiry received:', {
      name,
      email,
      phone,
      message,
      propertyTitle,
      timestamp: new Date().toISOString()
    });

    // In a real application, you would:
    // 1. Send email to property owner
    // 2. Send confirmation email to inquirer
    // 3. Store inquiry in database

    return NextResponse.json({ 
      success: true, 
      message: 'Inquiry sent successfully' 
    });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ 
      error: 'Failed to send inquiry' 
    }, { status: 500 });
  }
}
