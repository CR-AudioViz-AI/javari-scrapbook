import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TEMPLATE_CATEGORIES = {
  'baby': {
    name: 'Baby & Newborn',
    templates: [
      { id: 'baby-1', name: 'Welcome Baby', slots: 1, style: 'centered' },
      { id: 'baby-2', name: 'Birth Announcement', slots: 1, style: 'elegant' },
      { id: 'baby-3', name: 'Monthly Milestones', slots: 12, style: 'grid' },
      { id: 'baby-4', name: 'First Year Collage', slots: 13, style: 'hero-grid' },
      { id: 'baby-5', name: 'Tiny Hands & Feet', slots: 4, style: 'quad' },
    ]
  },
  'wedding': {
    name: 'Wedding & Love',
    templates: [
      { id: 'wed-1', name: 'Save the Date', slots: 1, style: 'elegant' },
      { id: 'wed-2', name: 'Our Love Story', slots: 6, style: 'timeline' },
      { id: 'wed-3', name: 'Ceremony Highlights', slots: 8, style: 'grid' },
      { id: 'wed-4', name: 'The First Dance', slots: 4, style: 'filmstrip' },
      { id: 'wed-5', name: 'Reception Fun', slots: 9, style: 'mosaic' },
    ]
  },
  'birthday': {
    name: 'Birthday & Celebration',
    templates: [
      { id: 'bday-1', name: 'Party Invitation', slots: 1, style: 'festive' },
      { id: 'bday-2', name: 'Age Milestone', slots: 1, style: 'bold' },
      { id: 'bday-3', name: 'Party Recap', slots: 8, style: 'grid' },
      { id: 'bday-4', name: 'Cake Smash', slots: 4, style: 'sequence' },
      { id: 'bday-5', name: 'Through the Years', slots: 10, style: 'timeline' },
    ]
  },
  'travel': {
    name: 'Travel & Adventure',
    templates: [
      { id: 'trav-1', name: 'Trip Cover', slots: 1, style: 'hero' },
      { id: 'trav-2', name: 'Day Grid', slots: 9, style: 'grid' },
      { id: 'trav-3', name: 'Postcard Style', slots: 1, style: 'postcard' },
      { id: 'trav-4', name: 'Map Journey', slots: 5, style: 'map' },
      { id: 'trav-5', name: 'Food Tour', slots: 6, style: 'food' },
    ]
  },
  'family': {
    name: 'Family & Gatherings',
    templates: [
      { id: 'fam-1', name: 'Family Portrait', slots: 1, style: 'formal' },
      { id: 'fam-2', name: 'Generation Photo', slots: 4, style: 'layers' },
      { id: 'fam-3', name: 'Family Tree', slots: 15, style: 'tree' },
      { id: 'fam-4', name: 'Reunion Recap', slots: 12, style: 'grid' },
    ]
  },
  'holidays': {
    name: 'Holidays & Seasons',
    templates: [
      { id: 'hol-1', name: 'Christmas Card', slots: 1, style: 'festive' },
      { id: 'hol-2', name: 'Christmas Morning', slots: 8, style: 'magical' },
      { id: 'hol-3', name: 'Thanksgiving Feast', slots: 6, style: 'autumn' },
      { id: 'hol-4', name: 'Easter Celebration', slots: 6, style: 'spring' },
      { id: 'hol-5', name: 'Halloween Fun', slots: 8, style: 'spooky' },
    ]
  },
  'everyday': {
    name: 'Everyday Moments',
    templates: [
      { id: 'day-1', name: 'Day in the Life', slots: 8, style: 'documentary' },
      { id: 'day-2', name: 'Simple Joys', slots: 4, style: 'minimal' },
      { id: 'day-3', name: 'At Home', slots: 6, style: 'cozy' },
      { id: 'day-4', name: 'Outdoor Play', slots: 6, style: 'active' },
    ]
  },
  'school': {
    name: 'School & Education',
    templates: [
      { id: 'sch-1', name: 'First Day of School', slots: 1, style: 'milestone' },
      { id: 'sch-2', name: 'Class Photo', slots: 1, style: 'group' },
      { id: 'sch-3', name: 'Graduation', slots: 5, style: 'formal' },
      { id: 'sch-4', name: 'Sports Season', slots: 6, style: 'athletic' },
    ]
  },
};

const LAYOUT_STYLES = {
  'centered': { photoAreas: [{ x: '25%', y: '20%', w: '50%', h: '50%' }] },
  'grid': { photoAreas: Array.from({ length: 9 }, (_, i) => ({ x: `${(i % 3) * 33}%`, y: `${Math.floor(i / 3) * 33}%`, w: '32%', h: '32%' })) },
  'hero-grid': { photoAreas: [{ x: '2%', y: '2%', w: '60%', h: '96%' }] },
  'filmstrip': { photoAreas: Array.from({ length: 4 }, (_, i) => ({ x: `${i * 25}%`, y: '25%', w: '24%', h: '50%' })) },
  'timeline': { photoAreas: Array.from({ length: 6 }, (_, i) => ({ x: i % 2 === 0 ? '5%' : '55%', y: `${5 + Math.floor(i / 2) * 32}%`, w: '40%', h: '28%' })) },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const templateId = searchParams.get('id');
  const search = searchParams.get('search');

  try {
    if (templateId) {
      for (const [catKey, cat] of Object.entries(TEMPLATE_CATEGORIES)) {
        const template = cat.templates.find(t => t.id === templateId);
        if (template) {
          const layoutStyle = LAYOUT_STYLES[template.style as keyof typeof LAYOUT_STYLES] || LAYOUT_STYLES['grid'];
          return NextResponse.json({ success: true, template: { ...template, category: catKey, categoryName: cat.name, layout: layoutStyle } });
        }
      }
      return NextResponse.json({ success: false, error: 'Template not found' }, { status: 404 });
    }

    if (category && TEMPLATE_CATEGORIES[category as keyof typeof TEMPLATE_CATEGORIES]) {
      const cat = TEMPLATE_CATEGORIES[category as keyof typeof TEMPLATE_CATEGORIES];
      return NextResponse.json({ success: true, category, name: cat.name, templates: cat.templates, count: cat.templates.length });
    }

    if (search) {
      const searchLower = search.toLowerCase();
      const results: { id: string; name: string; slots: number; style: string; category: string; categoryName: string }[] = [];
      Object.entries(TEMPLATE_CATEGORIES).forEach(([catKey, cat]) => {
        cat.templates.forEach(template => {
          if (template.name.toLowerCase().includes(searchLower)) {
            results.push({ ...template, category: catKey, categoryName: cat.name });
          }
        });
      });
      return NextResponse.json({ success: true, search, results, count: results.length });
    }

    const categories = Object.entries(TEMPLATE_CATEGORIES).map(([key, cat]) => ({
      id: key, name: cat.name, count: cat.templates.length,
    }));
    const totalTemplates = Object.values(TEMPLATE_CATEGORIES).reduce((acc, cat) => acc + cat.templates.length, 0);
    return NextResponse.json({ success: true, categories, totalTemplates, layoutStyles: Object.keys(LAYOUT_STYLES) });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch templates' }, { status: 500 });
  }
}
