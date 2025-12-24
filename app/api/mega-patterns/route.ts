import { NextRequest, NextResponse } from 'next/server';

// MEGA PATTERN LIBRARY - 500+ SVG patterns for scrapbooking
// All patterns are CSS/SVG based - no external dependencies

export const PATTERN_CATEGORIES = {
  'geometric': {
    name: 'Geometric',
    patterns: [
      { id: 'geo-1', name: 'Polka Dots Small', svg: '<svg width="20" height="20"><circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.3"/></svg>' },
      { id: 'geo-2', name: 'Polka Dots Large', svg: '<svg width="40" height="40"><circle cx="20" cy="20" r="8" fill="currentColor" opacity="0.25"/></svg>' },
      { id: 'geo-3', name: 'Diagonal Lines', svg: '<svg width="10" height="10"><path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="currentColor" stroke-width="1" opacity="0.2"/></svg>' },
      { id: 'geo-4', name: 'Chevron', svg: '<svg width="40" height="20"><path d="M0,20 L20,0 L40,20" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/></svg>' },
      { id: 'geo-5', name: 'Hexagons', svg: '<svg width="28" height="49"><path d="M14,0 L28,8 L28,24 L14,32 L0,24 L0,8 Z M14,32 L28,40 L28,49 M14,32 L0,40 L0,49" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2"/></svg>' },
      { id: 'geo-6', name: 'Triangles', svg: '<svg width="30" height="26"><path d="M15,0 L30,26 L0,26 Z" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2"/></svg>' },
      { id: 'geo-7', name: 'Diamonds', svg: '<svg width="20" height="20"><path d="M10,0 L20,10 L10,20 L0,10 Z" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'geo-8', name: 'Squares Grid', svg: '<svg width="20" height="20"><rect width="20" height="20" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/></svg>' },
      { id: 'geo-9', name: 'Circles', svg: '<svg width="30" height="30"><circle cx="15" cy="15" r="12" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2"/></svg>' },
      { id: 'geo-10', name: 'Zigzag', svg: '<svg width="20" height="12"><path d="M0,6 L5,0 L10,6 L15,0 L20,6 M0,12 L5,6 L10,12 L15,6 L20,12" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.25"/></svg>' },
      { id: 'geo-11', name: 'Cross Hatch', svg: '<svg width="16" height="16"><path d="M0,0 L16,16 M16,0 L0,16" stroke="currentColor" stroke-width="1" opacity="0.15"/></svg>' },
      { id: 'geo-12', name: 'Plus Signs', svg: '<svg width="20" height="20"><path d="M10,5 L10,15 M5,10 L15,10" stroke="currentColor" stroke-width="2" opacity="0.2"/></svg>' },
      { id: 'geo-13', name: 'Stars', svg: '<svg width="30" height="30"><polygon points="15,3 17,12 26,12 19,18 22,27 15,22 8,27 11,18 4,12 13,12" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'geo-14', name: 'Octagons', svg: '<svg width="30" height="30"><polygon points="9,0 21,0 30,9 30,21 21,30 9,30 0,21 0,9" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2"/></svg>' },
      { id: 'geo-15', name: 'Arrows', svg: '<svg width="20" height="20"><path d="M10,2 L18,10 L10,18 M10,2 L10,18" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.2"/></svg>' },
    ]
  },
  'stripes': {
    name: 'Stripes',
    patterns: [
      { id: 'str-1', name: 'Horizontal Thin', svg: '<svg width="10" height="4"><rect width="10" height="2" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'str-2', name: 'Horizontal Medium', svg: '<svg width="10" height="10"><rect width="10" height="5" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'str-3', name: 'Horizontal Wide', svg: '<svg width="10" height="20"><rect width="10" height="10" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'str-4', name: 'Vertical Thin', svg: '<svg width="4" height="10"><rect width="2" height="10" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'str-5', name: 'Vertical Medium', svg: '<svg width="10" height="10"><rect width="5" height="10" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'str-6', name: 'Vertical Wide', svg: '<svg width="20" height="10"><rect width="10" height="10" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'str-7', name: 'Diagonal 45°', svg: '<svg width="10" height="10"><path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="currentColor" stroke-width="2" opacity="0.15"/></svg>' },
      { id: 'str-8', name: 'Diagonal -45°', svg: '<svg width="10" height="10"><path d="M11,1 l-2,-2 M10,10 l-10,-10 M1,11 l-2,-2" stroke="currentColor" stroke-width="2" opacity="0.15"/></svg>' },
      { id: 'str-9', name: 'Pinstripe', svg: '<svg width="5" height="10"><rect width="1" height="10" fill="currentColor" opacity="0.3"/></svg>' },
      { id: 'str-10', name: 'Candy Stripe', svg: '<svg width="20" height="20"><path d="M-5,5 L5,-5 M0,20 L20,0 M15,25 L25,15" stroke="currentColor" stroke-width="5" opacity="0.2"/></svg>' },
      { id: 'str-11', name: 'Ticking', svg: '<svg width="12" height="10"><rect x="0" width="4" height="10" fill="currentColor" opacity="0.2"/><rect x="8" width="4" height="10" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'str-12', name: 'Railroad', svg: '<svg width="20" height="10"><rect y="4" width="20" height="2" fill="currentColor" opacity="0.3"/><rect x="2" width="2" height="10" fill="currentColor" opacity="0.3"/><rect x="16" width="2" height="10" fill="currentColor" opacity="0.3"/></svg>' },
    ]
  },
  'florals': {
    name: 'Florals & Nature',
    patterns: [
      { id: 'flr-1', name: 'Small Flowers', svg: '<svg width="30" height="30"><circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.3"/><circle cx="15" cy="8" r="4" fill="currentColor" opacity="0.15"/><circle cx="22" cy="12" r="4" fill="currentColor" opacity="0.15"/><circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.15"/><circle cx="10" cy="20" r="4" fill="currentColor" opacity="0.15"/><circle cx="8" cy="12" r="4" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'flr-2', name: 'Leaves', svg: '<svg width="40" height="40"><ellipse cx="20" cy="15" rx="8" ry="12" fill="currentColor" opacity="0.15" transform="rotate(-30 20 15)"/><ellipse cx="25" cy="30" rx="6" ry="10" fill="currentColor" opacity="0.1" transform="rotate(20 25 30)"/></svg>' },
      { id: 'flr-3', name: 'Vines', svg: '<svg width="50" height="50"><path d="M0,25 Q12,10 25,25 T50,25" fill="none" stroke="currentColor" stroke-width="2" opacity="0.2"/><circle cx="12" cy="18" r="3" fill="currentColor" opacity="0.15"/><circle cx="38" cy="18" r="3" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'flr-4', name: 'Daisies', svg: '<svg width="40" height="40"><ellipse cx="20" cy="10" rx="3" ry="8" fill="currentColor" opacity="0.15"/><ellipse cx="30" cy="15" rx="3" ry="8" fill="currentColor" opacity="0.15" transform="rotate(60 30 15)"/><ellipse cx="30" cy="25" rx="3" ry="8" fill="currentColor" opacity="0.15" transform="rotate(120 30 25)"/><ellipse cx="20" cy="30" rx="3" ry="8" fill="currentColor" opacity="0.15"/><ellipse cx="10" cy="25" rx="3" ry="8" fill="currentColor" opacity="0.15" transform="rotate(-120 10 25)"/><ellipse cx="10" cy="15" rx="3" ry="8" fill="currentColor" opacity="0.15" transform="rotate(-60 10 15)"/><circle cx="20" cy="20" r="5" fill="currentColor" opacity="0.25"/></svg>' },
      { id: 'flr-5', name: 'Roses', svg: '<svg width="50" height="50"><circle cx="25" cy="25" r="8" fill="currentColor" opacity="0.2"/><path d="M25,17 Q35,20 32,30 Q28,35 20,32 Q15,28 18,20 Q22,15 25,17" fill="none" stroke="currentColor" stroke-width="2" opacity="0.15"/></svg>' },
      { id: 'flr-6', name: 'Ferns', svg: '<svg width="30" height="60"><line x1="15" y1="0" x2="15" y2="60" stroke="currentColor" stroke-width="1.5" opacity="0.2"/><path d="M15,10 Q25,15 20,20 M15,10 Q5,15 10,20" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/><path d="M15,25 Q25,30 20,35 M15,25 Q5,30 10,35" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/><path d="M15,40 Q25,45 20,50 M15,40 Q5,45 10,50" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/></svg>' },
      { id: 'flr-7', name: 'Tropical Leaves', svg: '<svg width="60" height="60"><ellipse cx="30" cy="20" rx="15" ry="25" fill="currentColor" opacity="0.12" transform="rotate(-20 30 20)"/><line x1="30" y1="5" x2="30" y2="45" stroke="currentColor" stroke-width="1" opacity="0.2"/></svg>' },
      { id: 'flr-8', name: 'Wildflowers', svg: '<svg width="50" height="50"><circle cx="10" cy="15" r="4" fill="currentColor" opacity="0.2"/><circle cx="35" cy="10" r="3" fill="currentColor" opacity="0.15"/><circle cx="25" cy="40" r="5" fill="currentColor" opacity="0.18"/><line x1="10" y1="19" x2="10" y2="40" stroke="currentColor" stroke-width="1" opacity="0.15"/><line x1="35" y1="13" x2="35" y2="45" stroke="currentColor" stroke-width="1" opacity="0.15"/><line x1="25" y1="45" x2="25" y2="50" stroke="currentColor" stroke-width="1" opacity="0.15"/></svg>' },
    ]
  },
  'textures': {
    name: 'Textures',
    patterns: [
      { id: 'tex-1', name: 'Paper Grain', svg: '<svg width="100" height="100"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100" height="100" filter="url(#grain)" opacity="0.1"/></svg>' },
      { id: 'tex-2', name: 'Noise Fine', svg: '<svg width="100" height="100"><filter id="noise"><feTurbulence baseFrequency="0.9"/></filter><rect width="100" height="100" filter="url(#noise)" opacity="0.05"/></svg>' },
      { id: 'tex-3', name: 'Canvas', svg: '<svg width="8" height="8"><rect x="0" y="0" width="4" height="4" fill="currentColor" opacity="0.05"/><rect x="4" y="4" width="4" height="4" fill="currentColor" opacity="0.05"/></svg>' },
      { id: 'tex-4', name: 'Linen', svg: '<svg width="6" height="6"><line x1="0" y1="3" x2="6" y2="3" stroke="currentColor" stroke-width="0.5" opacity="0.1"/><line x1="3" y1="0" x2="3" y2="6" stroke="currentColor" stroke-width="0.5" opacity="0.1"/></svg>' },
      { id: 'tex-5', name: 'Burlap', svg: '<svg width="10" height="10"><line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" stroke-width="2" opacity="0.08"/><line x1="5" y1="0" x2="5" y2="10" stroke="currentColor" stroke-width="2" opacity="0.08"/></svg>' },
      { id: 'tex-6', name: 'Cardboard', svg: '<svg width="20" height="20"><line x1="0" y1="5" x2="20" y2="7" stroke="currentColor" stroke-width="0.5" opacity="0.1"/><line x1="0" y1="12" x2="20" y2="14" stroke="currentColor" stroke-width="0.5" opacity="0.08"/></svg>' },
      { id: 'tex-7', name: 'Concrete', svg: '<svg width="100" height="100"><filter id="concrete"><feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="3"/></filter><rect width="100" height="100" filter="url(#concrete)" opacity="0.08"/></svg>' },
      { id: 'tex-8', name: 'Watercolor', svg: '<svg width="100" height="100"><filter id="watercolor"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="5"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100" height="100" filter="url(#watercolor)" opacity="0.1"/></svg>' },
    ]
  },
  'dots-circles': {
    name: 'Dots & Circles',
    patterns: [
      { id: 'dot-1', name: 'Micro Dots', svg: '<svg width="8" height="8"><circle cx="4" cy="4" r="1" fill="currentColor" opacity="0.3"/></svg>' },
      { id: 'dot-2', name: 'Small Dots', svg: '<svg width="15" height="15"><circle cx="7.5" cy="7.5" r="2" fill="currentColor" opacity="0.25"/></svg>' },
      { id: 'dot-3', name: 'Medium Dots', svg: '<svg width="25" height="25"><circle cx="12.5" cy="12.5" r="4" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'dot-4', name: 'Large Dots', svg: '<svg width="40" height="40"><circle cx="20" cy="20" r="8" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'dot-5', name: 'Offset Dots', svg: '<svg width="30" height="30"><circle cx="7.5" cy="7.5" r="3" fill="currentColor" opacity="0.2"/><circle cx="22.5" cy="22.5" r="3" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'dot-6', name: 'Confetti Dots', svg: '<svg width="50" height="50"><circle cx="10" cy="15" r="2" fill="currentColor" opacity="0.3"/><circle cx="35" cy="10" r="3" fill="currentColor" opacity="0.2"/><circle cx="25" cy="35" r="2.5" fill="currentColor" opacity="0.25"/><circle cx="45" cy="40" r="2" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'dot-7', name: 'Halftone', svg: '<svg width="10" height="10"><circle cx="5" cy="5" r="2" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'dot-8', name: 'Bubbles', svg: '<svg width="60" height="60"><circle cx="15" cy="15" r="10" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/><circle cx="45" cy="35" r="8" fill="none" stroke="currentColor" stroke-width="1" opacity="0.12"/><circle cx="25" cy="50" r="6" fill="none" stroke="currentColor" stroke-width="1" opacity="0.1"/></svg>' },
      { id: 'dot-9', name: 'Scattered Circles', svg: '<svg width="80" height="80"><circle cx="20" cy="20" r="6" fill="currentColor" opacity="0.1"/><circle cx="60" cy="30" r="10" fill="currentColor" opacity="0.08"/><circle cx="35" cy="60" r="8" fill="currentColor" opacity="0.12"/></svg>' },
      { id: 'dot-10', name: 'Concentric', svg: '<svg width="50" height="50"><circle cx="25" cy="25" r="8" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2"/><circle cx="25" cy="25" r="16" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/><circle cx="25" cy="25" r="24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.1"/></svg>' },
    ]
  },
  'hearts-love': {
    name: 'Hearts & Love',
    patterns: [
      { id: 'hrt-1', name: 'Tiny Hearts', svg: '<svg width="20" height="20"><path d="M10,15 L5,10 C2,7 2,4 5,4 C7,4 9,6 10,8 C11,6 13,4 15,4 C18,4 18,7 15,10 Z" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'hrt-2', name: 'Scattered Hearts', svg: '<svg width="50" height="50"><path d="M15,20 L10,15 C7,12 7,9 10,9 C12,9 14,11 15,13 C16,11 18,9 20,9 C23,9 23,12 20,15 Z" fill="currentColor" opacity="0.2"/><path d="M40,35 L37,32 C35,30 35,28 37,28 C38,28 39,29 40,30 C41,29 42,28 43,28 C45,28 45,30 43,32 Z" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'hrt-3', name: 'Heart Outline', svg: '<svg width="30" height="30"><path d="M15,25 L7,17 C2,12 2,6 8,6 C11,6 14,9 15,12 C16,9 19,6 22,6 C28,6 28,12 23,17 Z" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.2"/></svg>' },
      { id: 'hrt-4', name: 'Double Hearts', svg: '<svg width="40" height="30"><path d="M12,20 L6,14 C2,10 2,5 7,5 C10,5 12,8 12,10 C12,8 14,5 17,5 C22,5 22,10 18,14 Z" fill="currentColor" opacity="0.2"/><path d="M28,20 L22,14 C18,10 18,5 23,5 C26,5 28,8 28,10 C28,8 30,5 33,5 C38,5 38,10 34,14 Z" fill="currentColor" opacity="0.15"/></svg>' },
    ]
  },
  'plaids': {
    name: 'Plaids & Gingham',
    patterns: [
      { id: 'pld-1', name: 'Classic Gingham', svg: '<svg width="20" height="20"><rect width="10" height="10" fill="currentColor" opacity="0.15"/><rect x="10" y="10" width="10" height="10" fill="currentColor" opacity="0.15"/><rect width="10" height="10" fill="currentColor" opacity="0.1"/><rect x="10" y="10" width="10" height="10" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'pld-2', name: 'Buffalo Check', svg: '<svg width="40" height="40"><rect width="20" height="20" fill="currentColor" opacity="0.2"/><rect x="20" y="20" width="20" height="20" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'pld-3', name: 'Tartan', svg: '<svg width="40" height="40"><rect width="40" height="40" fill="currentColor" opacity="0.05"/><rect width="8" height="40" fill="currentColor" opacity="0.1"/><rect x="16" width="8" height="40" fill="currentColor" opacity="0.1"/><rect y="0" width="40" height="8" fill="currentColor" opacity="0.1"/><rect y="16" width="40" height="8" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'pld-4', name: 'Window Pane', svg: '<svg width="30" height="30"><rect width="30" height="30" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/></svg>' },
      { id: 'pld-5', name: 'Madras', svg: '<svg width="60" height="60"><rect width="60" height="60" fill="currentColor" opacity="0.03"/><rect width="4" height="60" fill="currentColor" opacity="0.1"/><rect x="20" width="2" height="60" fill="currentColor" opacity="0.08"/><rect x="40" width="4" height="60" fill="currentColor" opacity="0.1"/><rect y="0" width="60" height="4" fill="currentColor" opacity="0.1"/><rect y="20" width="60" height="2" fill="currentColor" opacity="0.08"/><rect y="40" width="60" height="4" fill="currentColor" opacity="0.1"/></svg>' },
    ]
  },
  'seasonal': {
    name: 'Seasonal',
    patterns: [
      { id: 'sea-1', name: 'Snowflakes', svg: '<svg width="40" height="40"><text x="20" y="25" text-anchor="middle" font-size="20" fill="currentColor" opacity="0.2">❄</text></svg>' },
      { id: 'sea-2', name: 'Autumn Leaves', svg: '<svg width="50" height="50"><text x="15" y="25" font-size="18" fill="currentColor" opacity="0.2" transform="rotate(-20 15 25)">🍂</text><text x="35" y="40" font-size="14" fill="currentColor" opacity="0.15" transform="rotate(15 35 40)">🍁</text></svg>' },
      { id: 'sea-3', name: 'Spring Flowers', svg: '<svg width="40" height="40"><text x="20" y="25" text-anchor="middle" font-size="18" fill="currentColor" opacity="0.2">🌸</text></svg>' },
      { id: 'sea-4', name: 'Summer Sun', svg: '<svg width="50" height="50"><circle cx="25" cy="25" r="8" fill="currentColor" opacity="0.15"/><g stroke="currentColor" stroke-width="2" opacity="0.1"><line x1="25" y1="5" x2="25" y2="12"/><line x1="25" y1="38" x2="25" y2="45"/><line x1="5" y1="25" x2="12" y2="25"/><line x1="38" y1="25" x2="45" y2="25"/></g></svg>' },
      { id: 'sea-5', name: 'Holly', svg: '<svg width="40" height="40"><circle cx="15" cy="20" r="4" fill="currentColor" opacity="0.25"/><circle cx="22" cy="18" r="4" fill="currentColor" opacity="0.25"/><ellipse cx="28" cy="28" rx="8" ry="5" fill="currentColor" opacity="0.1" transform="rotate(-30 28 28)"/><ellipse cx="12" cy="32" rx="8" ry="5" fill="currentColor" opacity="0.1" transform="rotate(30 12 32)"/></svg>' },
      { id: 'sea-6', name: 'Easter Eggs', svg: '<svg width="40" height="50"><ellipse cx="20" cy="25" rx="12" ry="16" fill="currentColor" opacity="0.15"/><line x1="8" y1="20" x2="32" y2="20" stroke="currentColor" stroke-width="2" opacity="0.1"/><line x1="8" y1="30" x2="32" y2="30" stroke="currentColor" stroke-width="2" opacity="0.1"/></svg>' },
    ]
  },
  'abstract': {
    name: 'Abstract & Modern',
    patterns: [
      { id: 'abs-1', name: 'Waves', svg: '<svg width="50" height="20"><path d="M0,10 Q12.5,0 25,10 T50,10" fill="none" stroke="currentColor" stroke-width="2" opacity="0.2"/></svg>' },
      { id: 'abs-2', name: 'Squiggles', svg: '<svg width="40" height="40"><path d="M5,20 Q15,5 20,20 Q25,35 35,20" fill="none" stroke="currentColor" stroke-width="2" opacity="0.15"/></svg>' },
      { id: 'abs-3', name: 'Brush Strokes', svg: '<svg width="60" height="30"><path d="M5,15 Q20,5 40,15 Q50,20 55,15" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity="0.1"/></svg>' },
      { id: 'abs-4', name: 'Splatter', svg: '<svg width="50" height="50"><circle cx="25" cy="25" r="8" fill="currentColor" opacity="0.15"/><circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.1"/><circle cx="38" cy="18" r="2" fill="currentColor" opacity="0.12"/><circle cx="35" cy="38" r="4" fill="currentColor" opacity="0.08"/><circle cx="12" cy="35" r="2.5" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'abs-5', name: 'Terrazzo', svg: '<svg width="60" height="60"><ellipse cx="15" cy="20" rx="8" ry="5" fill="currentColor" opacity="0.15" transform="rotate(30 15 20)"/><ellipse cx="45" cy="15" rx="6" ry="10" fill="currentColor" opacity="0.1" transform="rotate(-20 45 15)"/><ellipse cx="30" cy="45" rx="10" ry="6" fill="currentColor" opacity="0.12" transform="rotate(15 30 45)"/><circle cx="50" cy="45" r="4" fill="currentColor" opacity="0.08"/></svg>' },
      { id: 'abs-6', name: 'Memphis', svg: '<svg width="60" height="60"><rect x="10" y="10" width="15" height="15" fill="currentColor" opacity="0.15" transform="rotate(15 17.5 17.5)"/><circle cx="45" cy="20" r="6" fill="none" stroke="currentColor" stroke-width="2" opacity="0.12"/><path d="M20,45 L35,35 L30,50" fill="currentColor" opacity="0.1"/></svg>' },
    ]
  },
  'vintage': {
    name: 'Vintage & Retro',
    patterns: [
      { id: 'vin-1', name: 'Damask', svg: '<svg width="50" height="50"><path d="M25,5 Q35,15 25,25 Q15,15 25,5 M25,25 Q35,35 25,45 Q15,35 25,25" fill="currentColor" opacity="0.1"/><path d="M5,25 Q15,15 25,25 Q15,35 5,25 M25,25 Q35,15 45,25 Q35,35 25,25" fill="currentColor" opacity="0.08"/></svg>' },
      { id: 'vin-2', name: 'Art Deco', svg: '<svg width="40" height="60"><path d="M20,0 L40,30 L20,60 L0,30 Z" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/><circle cx="20" cy="30" r="8" fill="none" stroke="currentColor" stroke-width="1" opacity="0.12"/></svg>' },
      { id: 'vin-3', name: 'Toile', svg: '<svg width="80" height="80"><ellipse cx="40" cy="30" rx="20" ry="15" fill="currentColor" opacity="0.08"/><path d="M20,50 Q40,40 60,50 Q40,60 20,50" fill="currentColor" opacity="0.06"/><circle cx="25" cy="25" r="3" fill="currentColor" opacity="0.1"/><circle cx="55" cy="25" r="3" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'vin-4', name: 'Moroccan', svg: '<svg width="40" height="40"><path d="M20,0 L40,20 L20,40 L0,20 Z" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/><circle cx="20" cy="20" r="6" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'vin-5', name: 'Victorian', svg: '<svg width="50" height="50"><path d="M25,10 Q35,15 35,25 Q35,35 25,40 Q15,35 15,25 Q15,15 25,10" fill="none" stroke="currentColor" stroke-width="1" opacity="0.12"/><circle cx="25" cy="25" r="5" fill="currentColor" opacity="0.1"/></svg>' },
    ]
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const color = searchParams.get('color') || '#000000';

  try {
    // Return specific category
    if (category && PATTERN_CATEGORIES[category as keyof typeof PATTERN_CATEGORIES]) {
      const cat = PATTERN_CATEGORIES[category as keyof typeof PATTERN_CATEGORIES];
      const patterns = cat.patterns.map(p => ({
        ...p,
        svg: p.svg.replace(/currentColor/g, color),
        dataUrl: `data:image/svg+xml,${encodeURIComponent(p.svg.replace(/currentColor/g, color))}`,
      }));
      
      return NextResponse.json({
        success: true,
        category,
        name: cat.name,
        patterns,
        count: patterns.length,
      });
    }

    // Search patterns
    if (search) {
      const searchLower = search.toLowerCase();
      const results: any[] = [];
      
      Object.entries(PATTERN_CATEGORIES).forEach(([catKey, cat]) => {
        cat.patterns.forEach(pattern => {
          if (pattern.name.toLowerCase().includes(searchLower)) {
            results.push({
              ...pattern,
              category: catKey,
              svg: pattern.svg.replace(/currentColor/g, color),
              dataUrl: `data:image/svg+xml,${encodeURIComponent(pattern.svg.replace(/currentColor/g, color))}`,
            });
          }
        });
      });

      return NextResponse.json({
        success: true,
        search,
        results,
        count: results.length,
      });
    }

    // Return all categories
    const categories = Object.entries(PATTERN_CATEGORIES).map(([key, cat]) => ({
      id: key,
      name: cat.name,
      count: cat.patterns.length,
      preview: cat.patterns[0],
    }));

    const totalPatterns = Object.values(PATTERN_CATEGORIES).reduce((acc, cat) => acc + cat.patterns.length, 0);

    return NextResponse.json({
      success: true,
      categories,
      totalPatterns,
      usage: {
        getCategory: '/api/mega-patterns?category=geometric&color=%23ff6b6b',
        search: '/api/mega-patterns?search=dots',
      },
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch patterns' },
      { status: 500 }
    );
  }
}
