import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { consentCheckbox, whatsappToggle, smsToggle, requestId } = body;
    const token = req.headers.get('Authorization')?.split(' ')[1];

    // Log the incoming request for debugging
    console.log('Consent API Request:', {
      body,
      token,
      headers: Object.fromEntries(req.headers.entries())
    });

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!requestId) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
    }

    if (!consentCheckbox) {
      return NextResponse.json({ error: 'Consent checkbox is required' }, { status: 400 });
    }

    // Mock successful consent submission
    const response = {
      message: 'Consent submitted successfully',
      data: {
        consentCheckbox,
        whatsappToggle,
        smsToggle,
        requestId,
        token
      }
    };

    // Log the response for debugging
    console.log('Consent API Response:', response);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error submitting consent:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 