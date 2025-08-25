import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { requestId, otp } = body;

    if (!requestId || !otp) {
      return NextResponse.json({ error: 'Request ID and OTP are required' }, { status: 400 });
    }

    // Mock OTP validation (accept any 4-digit OTP)
    if (!/^\d{4}$/.test(otp)) {
      return NextResponse.json({ error: 'Invalid OTP format' }, { status: 400 });
    }

    // Mock successful verification with JWT token
    return NextResponse.json({
      message: 'OTP verified successfully',
      token: `mock-jwt-token-${requestId}-${Date.now()}`,
      requestId,
    }, { status: 200 });
    // return  NextResponse.json({ error: 'Incorrect OTP!!' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
} 