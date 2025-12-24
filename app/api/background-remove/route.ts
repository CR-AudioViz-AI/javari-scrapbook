// app/api/background-remove/route.ts
// Remove.bg API integration for background removal
// Timestamp: Tuesday, December 24, 2025 – 1:08 PM Eastern Time
// CR AudioViz AI - "Your Story. Our Design"

import { NextRequest, NextResponse } from 'next/server';

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!REMOVE_BG_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Background removal service not configured' },
        { status: 500 }
      );
    }

    // Get the uploaded file
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Supported: JPG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    // Validate file size (25MB max for Remove.bg)
    const maxSize = 25 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 25MB' },
        { status: 400 }
      );
    }

    // Prepare form data for Remove.bg API
    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', imageFile);
    removeBgFormData.append('size', 'auto'); // auto, preview, small, regular, medium, hd, full, 4k
    removeBgFormData.append('format', 'png');
    removeBgFormData.append('type', 'auto'); // auto, person, product, car

    // Call Remove.bg API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
      body: removeBgFormData,
    });

    // Check for errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific error codes
      if (response.status === 402) {
        return NextResponse.json(
          { success: false, error: 'API credits exhausted. Please try again later.' },
          { status: 402 }
        );
      }
      
      if (response.status === 400) {
        return NextResponse.json(
          { success: false, error: errorData.errors?.[0]?.title || 'Invalid image' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Background removal failed. Please try again.' },
        { status: response.status }
      );
    }

    // Get the processed image as a buffer
    const imageBuffer = await response.arrayBuffer();
    
    // Convert to base64 data URL
    const base64 = Buffer.from(imageBuffer).toString('base64');
    const imageUrl = `data:image/png;base64,${base64}`;

    // Get credits info from response headers
    const creditsCharged = response.headers.get('X-Credits-Charged');

    return NextResponse.json({
      success: true,
      imageUrl,
      creditsUsed: creditsCharged ? parseFloat(creditsCharged) : 1,
    });

  } catch (error) {
    console.error('Background removal error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
