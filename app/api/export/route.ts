// app/api/export/route.ts
// Export Scrapbook to PDF, PNG, Print-Ready Formats

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { scrapbookId, format, options } = body;

    // Fetch scrapbook data
    const { data: scrapbook, error } = await supabase
      .from('scrapbooks')
      .select(`
        *,
        pages:scrapbook_pages(
          *,
          elements:scrapbook_elements(*)
        )
      `)
      .eq('id', scrapbookId)
      .order('page_order', { foreignTable: 'scrapbook_pages', ascending: true })
      .single();

    if (error) throw error;

    switch (format) {
      case 'pdf':
        return generatePDFConfig(scrapbook, options);
      case 'png':
        return generatePNGConfig(scrapbook, options);
      case 'print':
        return generatePrintConfig(scrapbook, options);
      case 'share':
        return generateShareConfig(scrapbook, options);
      default:
        return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generatePDFConfig(scrapbook: any, options: any) {
  const { quality = 'high', includeBleed = false, dpi = 300 } = options || {};
  
  // Return configuration for client-side PDF generation
  return NextResponse.json({
    format: 'pdf',
    config: {
      pageSize: {
        width: scrapbook.page_width,
        height: scrapbook.page_height,
        unit: 'px'
      },
      dpi,
      quality,
      includeBleed,
      bleedSize: includeBleed ? 36 : 0, // 0.125 inch bleed at 300dpi
      pages: scrapbook.pages.map((page: any) => ({
        id: page.id,
        background: page.background,
        elements: page.elements.sort((a: any, b: any) => a.z_index - b.z_index)
      })),
      metadata: {
        title: scrapbook.title,
        author: 'CRAV Scrapbook',
        subject: scrapbook.description,
        creator: 'CRAVScrapbook.com'
      }
    },
    clientLibrary: 'jspdf',
    instructions: [
      'Use html2canvas to render each page',
      'Add to jsPDF document',
      'Apply compression based on quality setting',
      'Include metadata'
    ]
  });
}

function generatePNGConfig(scrapbook: any, options: any) {
  const { pages = 'all', scale = 2, transparent = false } = options || {};
  
  return NextResponse.json({
    format: 'png',
    config: {
      scale,
      transparent,
      pages: pages === 'all' 
        ? scrapbook.pages.map((p: any, i: number) => i)
        : Array.isArray(pages) ? pages : [pages],
      pageData: scrapbook.pages.map((page: any) => ({
        id: page.id,
        name: page.name,
        width: scrapbook.page_width * scale,
        height: scrapbook.page_height * scale,
        background: page.background,
        elements: page.elements
      }))
    },
    clientLibrary: 'html2canvas',
    outputType: pages === 'all' ? 'zip' : 'single'
  });
}

function generatePrintConfig(scrapbook: any, options: any) {
  const { 
    paperSize = 'letter',
    bleed = true,
    cropMarks = true,
    colorProfile = 'srgb'
  } = options || {};

  const paperSizes: Record<string, { width: number; height: number }> = {
    letter: { width: 8.5, height: 11 },
    a4: { width: 8.27, height: 11.69 },
    '4x6': { width: 4, height: 6 },
    '5x7': { width: 5, height: 7 },
    '8x10': { width: 8, height: 10 },
    '11x14': { width: 11, height: 14 },
    '12x12': { width: 12, height: 12 }
  };

  const paper = paperSizes[paperSize] || paperSizes.letter;

  return NextResponse.json({
    format: 'print',
    config: {
      paperSize: paper,
      dpi: 300,
      bleed: bleed ? 0.125 : 0,
      safeZone: 0.25,
      cropMarks,
      colorProfile,
      totalPages: scrapbook.pages.length,
      estimatedFileSize: `${(scrapbook.pages.length * 15).toFixed(0)} MB`,
      printServices: [
        { name: 'Shutterfly', url: 'https://shutterfly.com' },
        { name: 'Snapfish', url: 'https://snapfish.com' },
        { name: 'Mixbook', url: 'https://mixbook.com' },
        { name: 'Artifact Uprising', url: 'https://artifactuprising.com' }
      ]
    },
    pages: scrapbook.pages.map((page: any) => ({
      id: page.id,
      order: page.page_order,
      background: page.background,
      elements: page.elements
    }))
  });
}

function generateShareConfig(scrapbook: any, options: any) {
  const { platform = 'link', quality = 'medium' } = options || {};

  const shareUrl = `https://cravscrapbook.com/view/${scrapbook.id}`;
  const embedCode = `<iframe src="${shareUrl}/embed" width="600" height="800" frameborder="0"></iframe>`;

  return NextResponse.json({
    format: 'share',
    config: {
      shareUrl,
      embedCode,
      socialLinks: {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(scrapbook.title)}`,
        pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(scrapbook.title)}`,
        email: `mailto:?subject=${encodeURIComponent(scrapbook.title)}&body=${encodeURIComponent(`Check out my scrapbook: ${shareUrl}`)}`
      },
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`,
      thumbnail: scrapbook.cover_image
    }
  });
}
