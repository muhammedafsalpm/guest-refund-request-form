import { supabase } from '@/lib/supabase';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';
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
    
    // Generate ticket number
    const ticketNumber = generateTicketNumber();
    
    const submission = {
      ticket_number: ticketNumber,
      full_name: body.fullName.trim(),
      email: body.email.trim().toLowerCase(),
      booking_reference: body.bookingReference.trim(),
      booking_date: body.bookingDate,
      refund_reason: body.refundReason,
      additional_details: body.additionalDetails ? body.additionalDetails.trim() : '',
      evidence_url: body.evidenceUrl || null,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    let supabaseError = null;
    let supabaseData = null;

    // Try to save to Supabase
    try {
      const { data, error } = await supabase
        .from('refund_requests')
        .insert([submission])
        .select()
        .single();
      
      if (error) {
        supabaseError = error.message;
        console.error('❌ Supabase insertion failed:', error.message);
      } else {
        supabaseData = data;
        console.log('✅ Supabase insertion successful');
      }
    } catch (err) {
      supabaseError = err.message;
      console.error('📡 Supabase connection error:', err.message);
    }

    // FALLBACK: Save to local JSON file
    const dataDir = path.join(process.cwd(), 'data');
    const dataFile = path.join(dataDir, 'submissions.json');
    
    try {
      // Ensure data directory exists
      await mkdir(dataDir, { recursive: true });
      
      let localSubmissions = [];
      try {
        const existingData = await readFile(dataFile, 'utf-8');
        localSubmissions = JSON.parse(existingData);
      } catch (e) {
        // File doesn't exist yet
      }
      
      localSubmissions.push({
        ...submission,
        id: supabaseData?.id || `local_${Date.now()}`,
        saved_to_cloud: !supabaseError
      });
      
      await writeFile(dataFile, JSON.stringify(localSubmissions, null, 2));
      console.log('📝 Submission saved to local data file.');
    } catch (fileError) {
      console.error('❌ Local file save failed:', fileError.message);
      // If even file save fails, we only error if DB also failed
      if (supabaseError) throw fileError;
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        id: supabaseData?.id || `local_${Date.now()}`,
        ticketNumber: submission.ticket_number,
        createdAt: submission.created_at,
        dbStatus: !supabaseError ? 'connected' : 'fallback-active',
        ...body,
      }
    });
    
  } catch (error) {
    console.error('Submission error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to submit request. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to view submissions (admin only - optional)
export async function GET(request) {
  try {
    let allSubmissions = [];
    
    // 1. Try to get from Supabase
    try {
      const { data, error } = await supabase
        .from('refund_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (!error && data) {
        allSubmissions = data.map(item => ({
          ...item,
          ticketNumber: item.ticket_number, // Compatibility
        }));
      }
    } catch (dbError) {
      console.error('📡 Could not fetch from Supabase:', dbError.message);
    }
    
    // 2. Try to get from Local Fallback
    try {
      const dataFile = path.join(process.cwd(), 'data', 'submissions.json');
      const localData = await readFile(dataFile, 'utf-8');
      const localSubmissions = JSON.parse(localData);
      
      // Merge and remove duplicates (by ticket_number)
      const existingTickets = new Set(allSubmissions.map(s => s.ticket_number));
      localSubmissions.forEach(ls => {
        if (!existingTickets.has(ls.ticket_number)) {
          allSubmissions.push(ls);
        }
      });
    } catch (fileError) {
      // Local file might not exist yet
    }
    
    // Sort combined list by date
    allSubmissions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    return NextResponse.json({ success: true, data: allSubmissions });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
