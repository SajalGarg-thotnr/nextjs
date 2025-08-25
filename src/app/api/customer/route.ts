import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get('request');
  // You can use requestId to return different data if needed
  return NextResponse.json({
    mobileNumber: '*****12345',
    requestId,
  }, { status: 200 });
} 