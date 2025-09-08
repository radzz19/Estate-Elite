import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '../../../scripts/seed-database';

export async function POST(request: NextRequest) {
  try {
    // Simple authentication check - in production, use proper admin authentication
    const { password } = await request.json();
    
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await seedDatabase();
    
    if (result.success) {
      return NextResponse.json({
        message: `Database seeded successfully with ${result.count} properties`,
        success: true
      });
    } else {
      return NextResponse.json({
        error: result.error,
        success: false
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json({
      error: 'Failed to seed database',
      success: false
    }, { status: 500 });
  }
}
