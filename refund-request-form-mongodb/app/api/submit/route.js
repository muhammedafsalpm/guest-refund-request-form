import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { validateForm } from '@/lib/validation';

// Helper to generate ticket number
function generateTicketNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `REF-${year}${month}${day}-${random}`;
}

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate form data
    const validationErrors = validateForm(body);
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        { success: false, errors: validationErrors },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'refund_requests');
    const collection = db.collection('refund_requests');
    
    // Generate ticket number
    const ticketNumber = generateTicketNumber();
    
    // Get IP address
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // Create submission object
    const submission = {
      ticketNumber,
      fullName: body.fullName.trim(),
      email: body.email.trim().toLowerCase(),
      bookingReference: body.bookingReference.trim(),
      bookingDate: new Date(body.bookingDate),
      refundReason: body.refundReason,
      additionalDetails: body.additionalDetails ? body.additionalDetails.trim() : '',
      evidenceUrl: body.evidenceUrl || null,
      status: 'pending',
      ipAddress,
      userAgent: request.headers.get('user-agent') || 'unknown',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Save to MongoDB
    const result = await collection.insertOne(submission);
    
    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        id: result.insertedId,
        ticketNumber: submission.ticketNumber,
        createdAt: submission.createdAt,
        ...body,
      }
    });
    
  } catch (error) {
    console.error('Submission error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Duplicate submission detected. Please try again.' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to submit request. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to view submissions (admin only - optional)
export async function GET(request) {
  try {
    // Optional: Add authentication here
    const authHeader = request.headers.get('authorization');
    
    // Simple auth check (you should implement proper auth)
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'refund_requests');
    const collection = db.collection('refund_requests');
    
    const submissions = await collection.find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    
    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
