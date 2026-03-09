// app/api/templates/route.ts
// Templates API endpoint

import { NextResponse } from 'next/server';
import { TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory, searchTemplates } from '@/lib/data/templates';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    let templates = TEMPLATES;

    if (category && category !== 'all') {
      templates = getTemplatesByCategory(category);
    }

    if (search) {
      templates = searchTemplates(search);
    }

    templates = templates.slice(0, limit);

    return NextResponse.json({
      templates: templates.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        category: t.category,
        thumbnail: t.thumbnail,
        tags: t.tags,
        isPremium: t.isPremium,
        pageCount: t.pageCount
      })),
      categories: TEMPLATE_CATEGORIES,
      total: templates.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
