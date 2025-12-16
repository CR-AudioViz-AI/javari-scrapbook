// app/api/qrcode/route.ts
// FREE QR Code Generation - Multiple Providers
// GoQR.me, QRServer (both 100% free, no limits)

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const data = searchParams.get('data') || searchParams.get('text') || 'https://craudiovizai.com';
  const size = parseInt(searchParams.get('size') || '200');
  const format = searchParams.get('format') || 'png'; // png, svg, eps
  const color = searchParams.get('color') || '000000';
  const bgColor = searchParams.get('bgcolor') || 'ffffff';
  const margin = parseInt(searchParams.get('margin') || '1');
  const errorCorrection = searchParams.get('ecc') || 'M'; // L, M, Q, H

  // Validate size (max 1000px)
  const validSize = Math.min(Math.max(size, 50), 1000);

  // GoQR.me URL (primary)
  const goqrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${validSize}x${validSize}&data=${encodeURIComponent(data)}&color=${color}&bgcolor=${bgColor}&margin=${margin}&ecc=${errorCorrection}&format=${format}`;

  // Alternative: Chart.googleapis.com (Google Charts - deprecated but still works)
  const googleUrl = `https://chart.googleapis.com/chart?cht=qr&chs=${validSize}x${validSize}&chl=${encodeURIComponent(data)}&choe=UTF-8`;

  return NextResponse.json({
    qrCode: {
      url: goqrUrl,
      alternateUrl: googleUrl,
      data,
      size: validSize,
      format,
      color: `#${color}`,
      backgroundColor: `#${bgColor}`,
      margin,
      errorCorrection: {
        level: errorCorrection,
        description: {
          'L': '7% recovery',
          'M': '15% recovery',
          'Q': '25% recovery',
          'H': '30% recovery'
        }[errorCorrection]
      }
    },
    usage: {
      types: [
        { type: 'url', example: 'https://example.com' },
        { type: 'text', example: 'Hello World' },
        { type: 'email', example: 'mailto:info@example.com' },
        { type: 'phone', example: 'tel:+1234567890' },
        { type: 'sms', example: 'sms:+1234567890?body=Hello' },
        { type: 'wifi', example: 'WIFI:T:WPA;S:NetworkName;P:Password;;' },
        { type: 'vcard', example: 'BEGIN:VCARD\\nVERSION:3.0\\nN:Doe;John\\nEND:VCARD' },
        { type: 'geo', example: 'geo:40.7128,-74.0060' }
      ]
    },
    provider: 'QRServer',
    attribution: 'QR codes by goqr.me - Free for commercial use'
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, size = 200, format = 'png', color = '000000', bgColor = 'ffffff', margin = 1, ecc = 'M' } = body;

    if (!data) {
      return NextResponse.json({ error: 'Data is required' }, { status: 400 });
    }

    const validSize = Math.min(Math.max(size, 50), 1000);
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${validSize}x${validSize}&data=${encodeURIComponent(data)}&color=${color}&bgcolor=${bgColor}&margin=${margin}&ecc=${ecc}&format=${format}`;

    return NextResponse.json({
      qrCode: {
        url,
        data,
        size: validSize,
        format
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
