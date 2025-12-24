import { NextRequest, NextResponse } from 'next/server';

const PATTERN_CATEGORIES = {
  'geometric': {
    name: 'Geometric',
    patterns: [
      { id: 'geo-1', name: 'Polka Dots Small', svg: '<svg width="20" height="20"><circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.3"/></svg>' },
      { id: 'geo-2', name: 'Polka Dots Medium', svg: '<svg width="30" height="30"><circle cx="15" cy="15" r="4" fill="currentColor" opacity="0.25"/></svg>' },
      { id: 'geo-3', name: 'Polka Dots Large', svg: '<svg width="50" height="50"><circle cx="25" cy="25" r="8" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'geo-4', name: 'Diagonal Lines Thin', svg: '<svg width="8" height="8"><path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4" stroke="currentColor" stroke-width="1" opacity="0.2"/></svg>' },
      { id: 'geo-5', name: 'Diagonal Lines Medium', svg: '<svg width="12" height="12"><path d="M-3,3 l6,-6 M0,12 l12,-12 M9,15 l6,-6" stroke="currentColor" stroke-width="2" opacity="0.15"/></svg>' },
      { id: 'geo-6', name: 'Diagonal Lines Thick', svg: '<svg width="20" height="20"><path d="M-5,5 l10,-10 M0,20 l20,-20 M15,25 l10,-10" stroke="currentColor" stroke-width="4" opacity="0.1"/></svg>' },
      { id: 'geo-7', name: 'Chevron Small', svg: '<svg width="30" height="15"><path d="M0,15 L15,0 L30,15" fill="none" stroke="currentColor" stroke-width="2" opacity="0.25"/></svg>' },
      { id: 'geo-8', name: 'Chevron Large', svg: '<svg width="60" height="30"><path d="M0,30 L30,0 L60,30" fill="none" stroke="currentColor" stroke-width="3" opacity="0.2"/></svg>' },
      { id: 'geo-9', name: 'Hexagons', svg: '<svg width="56" height="98"><path d="M28,0 L56,16 L56,48 L28,64 L0,48 L0,16 Z" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2"/></svg>' },
      { id: 'geo-10', name: 'Hexagons Filled', svg: '<svg width="56" height="98"><path d="M28,2 L54,17 L54,47 L28,62 L2,47 L2,17 Z" fill="currentColor" opacity="0.08"/></svg>' },
      { id: 'geo-11', name: 'Triangles Up', svg: '<svg width="40" height="35"><polygon points="20,0 40,35 0,35" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2"/></svg>' },
      { id: 'geo-12', name: 'Triangles Down', svg: '<svg width="40" height="35"><polygon points="20,35 0,0 40,0" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2"/></svg>' },
      { id: 'geo-13', name: 'Diamonds', svg: '<svg width="24" height="24"><path d="M12,0 L24,12 L12,24 L0,12 Z" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'geo-14', name: 'Diamonds Outline', svg: '<svg width="24" height="24"><path d="M12,2 L22,12 L12,22 L2,12 Z" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2"/></svg>' },
      { id: 'geo-15', name: 'Grid Square', svg: '<svg width="20" height="20"><rect width="20" height="20" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/></svg>' },
      { id: 'geo-16', name: 'Grid Fine', svg: '<svg width="10" height="10"><rect width="10" height="10" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.2"/></svg>' },
      { id: 'geo-17', name: 'Zigzag', svg: '<svg width="20" height="12"><path d="M0,6 L5,0 L10,6 L15,0 L20,6" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.25"/></svg>' },
      { id: 'geo-18', name: 'Waves', svg: '<svg width="40" height="20"><path d="M0,10 Q10,0 20,10 T40,10" fill="none" stroke="currentColor" stroke-width="2" opacity="0.2"/></svg>' },
      { id: 'geo-19', name: 'Circles Outline', svg: '<svg width="40" height="40"><circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/></svg>' },
      { id: 'geo-20', name: 'Crosses', svg: '<svg width="20" height="20"><path d="M10,4 L10,16 M4,10 L16,10" stroke="currentColor" stroke-width="2" opacity="0.2"/></svg>' },
      { id: 'geo-21', name: 'Plus Signs', svg: '<svg width="24" height="24"><path d="M12,6 L12,18 M6,12 L18,12" stroke="currentColor" stroke-width="1" opacity="0.25"/></svg>' },
      { id: 'geo-22', name: 'Octagons', svg: '<svg width="40" height="40"><polygon points="12,0 28,0 40,12 40,28 28,40 12,40 0,28 0,12" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/></svg>' },
      { id: 'geo-23', name: 'Stars Small', svg: '<svg width="20" height="20"><polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'geo-24', name: 'Moroccan', svg: '<svg width="40" height="40"><path d="M20,0 L40,20 L20,40 L0,20 Z M20,10 L30,20 L20,30 L10,20 Z" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/></svg>' },
      { id: 'geo-25', name: 'Herringbone', svg: '<svg width="20" height="40"><path d="M0,0 L10,20 L0,40 M10,0 L20,20 L10,40" fill="none" stroke="currentColor" stroke-width="2" opacity="0.15"/></svg>' }
    ]
  },
  'stripes': {
    name: 'Stripes & Lines',
    patterns: [
      { id: 'str-1', name: 'Horizontal Hairline', svg: '<svg width="10" height="2"><rect width="10" height="1" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'str-2', name: 'Horizontal Thin', svg: '<svg width="10" height="4"><rect width="10" height="2" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'str-3', name: 'Horizontal Medium', svg: '<svg width="10" height="8"><rect width="10" height="4" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'str-4', name: 'Horizontal Thick', svg: '<svg width="10" height="16"><rect width="10" height="8" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'str-5', name: 'Vertical Hairline', svg: '<svg width="2" height="10"><rect width="1" height="10" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'str-6', name: 'Vertical Thin', svg: '<svg width="4" height="10"><rect width="2" height="10" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'str-7', name: 'Vertical Medium', svg: '<svg width="8" height="10"><rect width="4" height="10" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'str-8', name: 'Vertical Thick', svg: '<svg width="16" height="10"><rect width="8" height="10" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'str-9', name: 'Diagonal 45 Thin', svg: '<svg width="10" height="10"><path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="currentColor" stroke-width="1" opacity="0.2"/></svg>' },
      { id: 'str-10', name: 'Diagonal 45 Medium', svg: '<svg width="10" height="10"><path d="M-2,2 l4,-4 M0,10 l10,-10 M8,12 l4,-4" stroke="currentColor" stroke-width="2" opacity="0.15"/></svg>' },
      { id: 'str-11', name: 'Diagonal 45 Thick', svg: '<svg width="16" height="16"><path d="M-4,4 l8,-8 M0,16 l16,-16 M12,20 l8,-8" stroke="currentColor" stroke-width="4" opacity="0.1"/></svg>' },
      { id: 'str-12', name: 'Diagonal -45', svg: '<svg width="10" height="10"><path d="M11,1 l-2,-2 M10,10 l-10,-10 M1,11 l-2,-2" stroke="currentColor" stroke-width="1" opacity="0.2"/></svg>' },
      { id: 'str-13', name: 'Pinstripe', svg: '<svg width="4" height="10"><rect width="1" height="10" fill="currentColor" opacity="0.3"/></svg>' },
      { id: 'str-14', name: 'Candy Stripe', svg: '<svg width="20" height="20"><path d="M-5,5 L5,-5 M0,20 L20,0 M15,25 L25,15" stroke="currentColor" stroke-width="5" opacity="0.15"/></svg>' },
      { id: 'str-15', name: 'Double Line Horiz', svg: '<svg width="10" height="8"><rect y="1" width="10" height="1" fill="currentColor" opacity="0.2"/><rect y="4" width="10" height="1" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'str-16', name: 'Double Line Vert', svg: '<svg width="8" height="10"><rect x="1" width="1" height="10" fill="currentColor" opacity="0.2"/><rect x="4" width="1" height="10" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'str-17', name: 'Ticking', svg: '<svg width="12" height="10"><rect x="5" width="2" height="10" fill="currentColor" opacity="0.3"/></svg>' },
      { id: 'str-18', name: 'Railroad', svg: '<svg width="20" height="10"><rect y="4" width="20" height="2" fill="currentColor" opacity="0.2"/><rect x="2" y="2" width="2" height="6" fill="currentColor" opacity="0.3"/><rect x="10" y="2" width="2" height="6" fill="currentColor" opacity="0.3"/><rect x="18" y="2" width="2" height="6" fill="currentColor" opacity="0.3"/></svg>' }
    ]
  },
  'dots': {
    name: 'Dots & Circles',
    patterns: [
      { id: 'dot-1', name: 'Micro Dots', svg: '<svg width="6" height="6"><circle cx="3" cy="3" r="0.5" fill="currentColor" opacity="0.3"/></svg>' },
      { id: 'dot-2', name: 'Tiny Dots', svg: '<svg width="8" height="8"><circle cx="4" cy="4" r="1" fill="currentColor" opacity="0.3"/></svg>' },
      { id: 'dot-3', name: 'Small Dots', svg: '<svg width="12" height="12"><circle cx="6" cy="6" r="1.5" fill="currentColor" opacity="0.25"/></svg>' },
      { id: 'dot-4', name: 'Medium Dots', svg: '<svg width="20" height="20"><circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'dot-5', name: 'Large Dots', svg: '<svg width="40" height="40"><circle cx="20" cy="20" r="8" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'dot-6', name: 'Huge Dots', svg: '<svg width="60" height="60"><circle cx="30" cy="30" r="15" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'dot-7', name: 'Offset Dots', svg: '<svg width="20" height="20"><circle cx="5" cy="5" r="2" fill="currentColor" opacity="0.25"/><circle cx="15" cy="15" r="2" fill="currentColor" opacity="0.25"/></svg>' },
      { id: 'dot-8', name: 'Confetti Small', svg: '<svg width="30" height="30"><circle cx="5" cy="10" r="1.5" fill="currentColor" opacity="0.3"/><circle cx="20" cy="5" r="2" fill="currentColor" opacity="0.2"/><circle cx="15" cy="22" r="1" fill="currentColor" opacity="0.25"/></svg>' },
      { id: 'dot-9', name: 'Confetti Large', svg: '<svg width="60" height="60"><circle cx="10" cy="20" r="3" fill="currentColor" opacity="0.25"/><circle cx="45" cy="15" r="5" fill="currentColor" opacity="0.15"/><circle cx="25" cy="45" r="4" fill="currentColor" opacity="0.2"/><circle cx="50" cy="50" r="2" fill="currentColor" opacity="0.3"/></svg>' },
      { id: 'dot-10', name: 'Ring Dots', svg: '<svg width="24" height="24"><circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="2" opacity="0.2"/></svg>' },
      { id: 'dot-11', name: 'Target Dots', svg: '<svg width="30" height="30"><circle cx="15" cy="15" r="8" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/><circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'dot-12', name: 'Scattered Dots', svg: '<svg width="50" height="50"><circle cx="8" cy="12" r="2" fill="currentColor" opacity="0.2"/><circle cx="35" cy="8" r="1.5" fill="currentColor" opacity="0.25"/><circle cx="22" cy="35" r="2.5" fill="currentColor" opacity="0.15"/><circle cx="42" cy="40" r="1" fill="currentColor" opacity="0.3"/><circle cx="15" cy="45" r="2" fill="currentColor" opacity="0.2"/></svg>' }
    ]
  },
  'florals': {
    name: 'Florals & Botanicals',
    patterns: [
      { id: 'flr-1', name: 'Simple Flower', svg: '<svg width="30" height="30"><circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.3"/><circle cx="15" cy="7" r="4" fill="currentColor" opacity="0.15"/><circle cx="22" cy="11" r="4" fill="currentColor" opacity="0.15"/><circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.15"/><circle cx="10" cy="20" r="4" fill="currentColor" opacity="0.15"/><circle cx="8" cy="11" r="4" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'flr-2', name: 'Daisy', svg: '<svg width="40" height="40"><circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.3"/><ellipse cx="20" cy="8" rx="3" ry="6" fill="currentColor" opacity="0.15"/><ellipse cx="20" cy="8" rx="3" ry="6" fill="currentColor" opacity="0.15" transform="rotate(45 20 20)"/><ellipse cx="20" cy="8" rx="3" ry="6" fill="currentColor" opacity="0.15" transform="rotate(90 20 20)"/><ellipse cx="20" cy="8" rx="3" ry="6" fill="currentColor" opacity="0.15" transform="rotate(135 20 20)"/><ellipse cx="20" cy="8" rx="3" ry="6" fill="currentColor" opacity="0.15" transform="rotate(180 20 20)"/><ellipse cx="20" cy="8" rx="3" ry="6" fill="currentColor" opacity="0.15" transform="rotate(225 20 20)"/><ellipse cx="20" cy="8" rx="3" ry="6" fill="currentColor" opacity="0.15" transform="rotate(270 20 20)"/><ellipse cx="20" cy="8" rx="3" ry="6" fill="currentColor" opacity="0.15" transform="rotate(315 20 20)"/></svg>' },
      { id: 'flr-3', name: 'Leaf Simple', svg: '<svg width="30" height="40"><ellipse cx="15" cy="20" rx="8" ry="15" fill="currentColor" opacity="0.15" transform="rotate(-15 15 20)"/><line x1="15" y1="8" x2="15" y2="35" stroke="currentColor" stroke-width="1" opacity="0.2"/></svg>' },
      { id: 'flr-4', name: 'Leaf Duo', svg: '<svg width="40" height="30"><ellipse cx="12" cy="15" rx="6" ry="12" fill="currentColor" opacity="0.12" transform="rotate(-30 12 15)"/><ellipse cx="28" cy="15" rx="6" ry="12" fill="currentColor" opacity="0.12" transform="rotate(30 28 15)"/></svg>' },
      { id: 'flr-5', name: 'Vine', svg: '<svg width="60" height="40"><path d="M0,20 Q15,10 30,20 T60,20" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2"/><ellipse cx="15" cy="12" rx="4" ry="8" fill="currentColor" opacity="0.1" transform="rotate(-20 15 12)"/><ellipse cx="45" cy="28" rx="4" ry="8" fill="currentColor" opacity="0.1" transform="rotate(20 45 28)"/></svg>' },
      { id: 'flr-6', name: 'Rose Outline', svg: '<svg width="40" height="40"><circle cx="20" cy="20" r="6" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2"/><circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/><circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" stroke-width="1" opacity="0.1"/></svg>' },
      { id: 'flr-7', name: 'Tulip', svg: '<svg width="30" height="50"><path d="M15,12 Q22,18 20,30 L15,35 L10,30 Q8,18 15,12" fill="currentColor" opacity="0.15"/><line x1="15" y1="35" x2="15" y2="48" stroke="currentColor" stroke-width="2" opacity="0.2"/></svg>' },
      { id: 'flr-8', name: 'Fern', svg: '<svg width="40" height="60"><path d="M20,5 L20,55" stroke="currentColor" stroke-width="1" opacity="0.2"/><ellipse cx="12" cy="15" rx="6" ry="3" fill="currentColor" opacity="0.1"/><ellipse cx="28" cy="20" rx="6" ry="3" fill="currentColor" opacity="0.1"/><ellipse cx="12" cy="30" rx="6" ry="3" fill="currentColor" opacity="0.1"/><ellipse cx="28" cy="35" rx="6" ry="3" fill="currentColor" opacity="0.1"/><ellipse cx="12" cy="45" rx="6" ry="3" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'flr-9', name: 'Botanical Scatter', svg: '<svg width="80" height="80"><ellipse cx="20" cy="25" rx="8" ry="14" fill="currentColor" opacity="0.1" transform="rotate(-20 20 25)"/><circle cx="55" cy="20" r="8" fill="currentColor" opacity="0.08"/><ellipse cx="65" cy="55" rx="6" ry="10" fill="currentColor" opacity="0.1" transform="rotate(15 65 55)"/><circle cx="25" cy="60" r="5" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'flr-10', name: 'Cherry Blossom', svg: '<svg width="30" height="30"><circle cx="15" cy="15" r="2" fill="currentColor" opacity="0.3"/><circle cx="15" cy="8" r="4" fill="currentColor" opacity="0.12"/><circle cx="21" cy="12" r="4" fill="currentColor" opacity="0.12"/><circle cx="19" cy="20" r="4" fill="currentColor" opacity="0.12"/><circle cx="11" cy="20" r="4" fill="currentColor" opacity="0.12"/><circle cx="9" cy="12" r="4" fill="currentColor" opacity="0.12"/></svg>' }
    ]
  },
  'hearts': {
    name: 'Hearts & Love',
    patterns: [
      { id: 'hrt-1', name: 'Tiny Hearts', svg: '<svg width="16" height="16"><path d="M8,12 L4,8 C2,6 2,4 4,4 C5.5,4 7,5 8,6.5 C9,5 10.5,4 12,4 C14,4 14,6 12,8 Z" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'hrt-2', name: 'Small Hearts', svg: '<svg width="24" height="24"><path d="M12,18 L6,12 C3,9 3,5 6,5 C8,5 10.5,7 12,9 C13.5,7 16,5 18,5 C21,5 21,9 18,12 Z" fill="currentColor" opacity="0.18"/></svg>' },
      { id: 'hrt-3', name: 'Medium Hearts', svg: '<svg width="36" height="36"><path d="M18,28 L9,19 C4,14 4,8 10,8 C13,8 16,11 18,14 C20,11 23,8 26,8 C32,8 32,14 27,19 Z" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'hrt-4', name: 'Heart Outline', svg: '<svg width="30" height="30"><path d="M15,24 L7,16 C3,12 3,7 8,7 C10.5,7 13,9 15,12 C17,9 19.5,7 22,7 C27,7 27,12 23,16 Z" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.2"/></svg>' },
      { id: 'hrt-5', name: 'Double Hearts', svg: '<svg width="40" height="30"><path d="M12,22 L6,16 C2,12 2,8 6,8 C8,8 10,10 12,12 C14,10 16,8 18,8 C22,8 22,12 18,16 Z" fill="currentColor" opacity="0.15"/><path d="M28,22 L22,16 C18,12 18,8 22,8 C24,8 26,10 28,12 C30,10 32,8 34,8 C38,8 38,12 34,16 Z" fill="currentColor" opacity="0.12"/></svg>' },
      { id: 'hrt-6', name: 'Scattered Hearts', svg: '<svg width="60" height="60"><path d="M15,20 L10,15 C7,12 7,9 10,9 C12,9 14,11 15,13 C16,11 18,9 20,9 C23,9 23,12 20,15 Z" fill="currentColor" opacity="0.2"/><path d="M45,40 L40,35 C37,32 37,29 40,29 C42,29 44,31 45,33 C46,31 48,29 50,29 C53,29 53,32 50,35 Z" fill="currentColor" opacity="0.15"/><path d="M35,15 L32,12 C30,10 30,8 32,8 C33,8 34,9 35,10 C36,9 37,8 38,8 C40,8 40,10 38,12 Z" fill="currentColor" opacity="0.18"/></svg>' },
      { id: 'hrt-7', name: 'Heart Grid', svg: '<svg width="30" height="30"><path d="M15,22 L10,17 C7,14 7,11 10,11 C11.5,11 13.5,12.5 15,14.5 C16.5,12.5 18.5,11 20,11 C23,11 23,14 20,17 Z" fill="currentColor" opacity="0.2"/></svg>' }
    ]
  },
  'plaids': {
    name: 'Plaids & Gingham',
    patterns: [
      { id: 'pld-1', name: 'Gingham Small', svg: '<svg width="16" height="16"><rect width="8" height="8" fill="currentColor" opacity="0.15"/><rect x="8" y="8" width="8" height="8" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'pld-2', name: 'Gingham Medium', svg: '<svg width="24" height="24"><rect width="12" height="12" fill="currentColor" opacity="0.15"/><rect x="12" y="12" width="12" height="12" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'pld-3', name: 'Gingham Large', svg: '<svg width="40" height="40"><rect width="20" height="20" fill="currentColor" opacity="0.15"/><rect x="20" y="20" width="20" height="20" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'pld-4', name: 'Buffalo Check', svg: '<svg width="48" height="48"><rect width="24" height="24" fill="currentColor" opacity="0.2"/><rect x="24" y="24" width="24" height="24" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'pld-5', name: 'Tartan Simple', svg: '<svg width="40" height="40"><rect width="40" height="40" fill="currentColor" opacity="0.05"/><rect x="0" y="16" width="40" height="8" fill="currentColor" opacity="0.1"/><rect x="16" y="0" width="8" height="40" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'pld-6', name: 'Window Pane', svg: '<svg width="50" height="50"><rect width="50" height="50" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/></svg>' },
      { id: 'pld-7', name: 'Graph Paper', svg: '<svg width="20" height="20"><rect width="20" height="20" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.15"/><rect width="10" height="10" fill="none" stroke="currentColor" stroke-width="0.25" opacity="0.1"/></svg>' },
      { id: 'pld-8', name: 'Houndstooth', svg: '<svg width="24" height="24"><path d="M0,0 L6,0 L12,6 L12,12 L6,12 L0,6 Z" fill="currentColor" opacity="0.15"/><path d="M12,12 L18,12 L24,18 L24,24 L18,24 L12,18 Z" fill="currentColor" opacity="0.15"/></svg>' }
    ]
  },
  'textures': {
    name: 'Textures & Grains',
    patterns: [
      { id: 'tex-1', name: 'Paper Grain', svg: '<svg width="100" height="100"><filter id="grain"><feTurbulence baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100" height="100" filter="url(#grain)" opacity="0.08"/></svg>' },
      { id: 'tex-2', name: 'Noise Light', svg: '<svg width="50" height="50"><circle cx="5" cy="5" r="0.5" fill="currentColor" opacity="0.1"/><circle cx="15" cy="8" r="0.3" fill="currentColor" opacity="0.15"/><circle cx="25" cy="3" r="0.4" fill="currentColor" opacity="0.12"/><circle cx="35" cy="12" r="0.5" fill="currentColor" opacity="0.1"/><circle cx="45" cy="7" r="0.3" fill="currentColor" opacity="0.15"/><circle cx="8" cy="22" r="0.4" fill="currentColor" opacity="0.12"/><circle cx="18" cy="28" r="0.5" fill="currentColor" opacity="0.1"/><circle cx="28" cy="18" r="0.3" fill="currentColor" opacity="0.15"/><circle cx="38" cy="25" r="0.4" fill="currentColor" opacity="0.12"/><circle cx="48" cy="30" r="0.5" fill="currentColor" opacity="0.1"/><circle cx="3" cy="38" r="0.3" fill="currentColor" opacity="0.15"/><circle cx="13" cy="45" r="0.4" fill="currentColor" opacity="0.12"/><circle cx="23" cy="35" r="0.5" fill="currentColor" opacity="0.1"/><circle cx="33" cy="42" r="0.3" fill="currentColor" opacity="0.15"/><circle cx="43" cy="48" r="0.4" fill="currentColor" opacity="0.12"/></svg>' },
      { id: 'tex-3', name: 'Linen', svg: '<svg width="4" height="4"><rect x="0" y="0" width="2" height="2" fill="currentColor" opacity="0.05"/><rect x="2" y="2" width="2" height="2" fill="currentColor" opacity="0.05"/></svg>' },
      { id: 'tex-4', name: 'Canvas', svg: '<svg width="6" height="6"><rect x="0" y="0" width="3" height="3" fill="currentColor" opacity="0.06"/><rect x="3" y="3" width="3" height="3" fill="currentColor" opacity="0.06"/></svg>' },
      { id: 'tex-5', name: 'Woven', svg: '<svg width="8" height="8"><rect x="0" y="0" width="4" height="2" fill="currentColor" opacity="0.08"/><rect x="4" y="2" width="4" height="2" fill="currentColor" opacity="0.08"/><rect x="0" y="4" width="4" height="2" fill="currentColor" opacity="0.08"/><rect x="4" y="6" width="4" height="2" fill="currentColor" opacity="0.08"/></svg>' },
      { id: 'tex-6', name: 'Burlap', svg: '<svg width="10" height="10"><rect x="0" y="0" width="5" height="2" fill="currentColor" opacity="0.1"/><rect x="5" y="2" width="5" height="2" fill="currentColor" opacity="0.1"/><rect x="0" y="4" width="2" height="6" fill="currentColor" opacity="0.08"/><rect x="5" y="4" width="2" height="6" fill="currentColor" opacity="0.08"/></svg>' },
      { id: 'tex-7', name: 'Denim', svg: '<svg width="6" height="6"><path d="M0,0 L6,6" stroke="currentColor" stroke-width="0.5" opacity="0.1"/><path d="M0,3 L3,6" stroke="currentColor" stroke-width="0.5" opacity="0.1"/><path d="M3,0 L6,3" stroke="currentColor" stroke-width="0.5" opacity="0.1"/></svg>' }
    ]
  },
  'seasonal': {
    name: 'Seasonal & Holiday',
    patterns: [
      { id: 'sea-1', name: 'Snowflakes', svg: '<svg width="40" height="40"><path d="M20,5 L20,35 M5,20 L35,20 M10,10 L30,30 M30,10 L10,30" stroke="currentColor" stroke-width="1" opacity="0.15"/><circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'sea-2', name: 'Stars', svg: '<svg width="30" height="30"><polygon points="15,3 17,11 25,11 19,16 21,24 15,19 9,24 11,16 5,11 13,11" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'sea-3', name: 'Christmas Trees', svg: '<svg width="30" height="40"><polygon points="15,5 25,20 20,20 28,32 2,32 10,20 5,20" fill="currentColor" opacity="0.12"/></svg>' },
      { id: 'sea-4', name: 'Autumn Leaves', svg: '<svg width="40" height="40"><ellipse cx="20" cy="18" rx="10" ry="14" fill="currentColor" opacity="0.12" transform="rotate(-30 20 18)"/><line x1="20" y1="8" x2="20" y2="35" stroke="currentColor" stroke-width="1" opacity="0.15"/></svg>' },
      { id: 'sea-5', name: 'Pumpkins', svg: '<svg width="35" height="35"><ellipse cx="17" cy="20" rx="14" ry="12" fill="currentColor" opacity="0.12"/><rect x="14" y="6" width="6" height="8" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'sea-6', name: 'Easter Eggs', svg: '<svg width="30" height="40"><ellipse cx="15" cy="22" rx="10" ry="14" fill="currentColor" opacity="0.12"/><path d="M5,18 Q15,15 25,18" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/><path d="M5,26 Q15,29 25,26" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/></svg>' },
      { id: 'sea-7', name: 'Bunnies', svg: '<svg width="30" height="40"><ellipse cx="15" cy="28" rx="10" ry="8" fill="currentColor" opacity="0.12"/><circle cx="15" cy="18" r="6" fill="currentColor" opacity="0.12"/><ellipse cx="10" cy="8" rx="3" ry="8" fill="currentColor" opacity="0.1"/><ellipse cx="20" cy="8" rx="3" ry="8" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'sea-8', name: 'Shamrocks', svg: '<svg width="30" height="35"><circle cx="11" cy="12" r="6" fill="currentColor" opacity="0.12"/><circle cx="19" cy="12" r="6" fill="currentColor" opacity="0.12"/><circle cx="15" cy="20" r="6" fill="currentColor" opacity="0.12"/><path d="M15,24 L15,33" stroke="currentColor" stroke-width="2" opacity="0.15"/></svg>' },
      { id: 'sea-9', name: 'Fireworks', svg: '<svg width="40" height="40"><circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.2"/><path d="M20,5 L20,12 M20,28 L20,35 M5,20 L12,20 M28,20 L35,20 M9,9 L14,14 M26,26 L31,31 M9,31 L14,26 M26,14 L31,9" stroke="currentColor" stroke-width="1" opacity="0.15"/></svg>' },
      { id: 'sea-10', name: 'Hearts Valentine', svg: '<svg width="25" height="25"><path d="M12.5,20 L6,13.5 C3,10.5 3,7 6,7 C8,7 10.5,9 12.5,11.5 C14.5,9 17,7 19,7 C22,7 22,10.5 19,13.5 Z" fill="currentColor" opacity="0.18"/></svg>' }
    ]
  },
  'abstract': {
    name: 'Abstract & Modern',
    patterns: [
      { id: 'abs-1', name: 'Squiggles', svg: '<svg width="50" height="30"><path d="M0,15 Q12.5,5 25,15 T50,15" fill="none" stroke="currentColor" stroke-width="2" opacity="0.15"/></svg>' },
      { id: 'abs-2', name: 'Loops', svg: '<svg width="40" height="40"><circle cx="20" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/><circle cx="20" cy="28" r="8" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/></svg>' },
      { id: 'abs-3', name: 'Organic Blobs', svg: '<svg width="60" height="60"><path d="M30,10 Q50,15 45,35 Q40,55 20,45 Q5,35 15,20 Q25,5 30,10" fill="currentColor" opacity="0.08"/></svg>' },
      { id: 'abs-4', name: 'Memphis Dots', svg: '<svg width="50" height="50"><circle cx="10" cy="10" r="4" fill="currentColor" opacity="0.2"/><circle cx="35" cy="25" r="6" fill="none" stroke="currentColor" stroke-width="2" opacity="0.15"/><rect x="20" y="38" width="8" height="8" fill="currentColor" opacity="0.15" transform="rotate(15 24 42)"/></svg>' },
      { id: 'abs-5', name: 'Terrazzo', svg: '<svg width="80" height="80"><polygon points="15,10 25,15 20,25 10,20" fill="currentColor" opacity="0.1"/><circle cx="50" cy="20" r="5" fill="currentColor" opacity="0.08"/><polygon points="65,45 75,50 70,60 60,55" fill="currentColor" opacity="0.1"/><circle cx="25" cy="55" r="4" fill="currentColor" opacity="0.08"/><polygon points="45,65 55,70 50,80 40,75" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'abs-6', name: 'Brush Strokes', svg: '<svg width="60" height="40"><path d="M5,20 Q20,10 35,25 T55,20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity="0.1"/></svg>' }
    ]
  },
  'vintage': {
    name: 'Vintage & Retro',
    patterns: [
      { id: 'vin-1', name: 'Art Deco Fans', svg: '<svg width="40" height="40"><path d="M0,40 Q20,20 40,40" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/><path d="M0,40 Q20,25 40,40" fill="none" stroke="currentColor" stroke-width="1" opacity="0.12"/><path d="M0,40 Q20,30 40,40" fill="none" stroke="currentColor" stroke-width="1" opacity="0.09"/></svg>' },
      { id: 'vin-2', name: 'Damask Simple', svg: '<svg width="50" height="60"><path d="M25,5 Q35,15 35,30 Q35,45 25,55 Q15,45 15,30 Q15,15 25,5" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'vin-3', name: 'Filigree', svg: '<svg width="60" height="60"><path d="M30,10 Q40,20 30,30 Q20,20 30,10" fill="none" stroke="currentColor" stroke-width="1" opacity="0.12"/><path d="M30,30 Q40,40 30,50 Q20,40 30,30" fill="none" stroke="currentColor" stroke-width="1" opacity="0.12"/><path d="M10,30 Q20,20 30,30 Q20,40 10,30" fill="none" stroke="currentColor" stroke-width="1" opacity="0.12"/><path d="M30,30 Q40,20 50,30 Q40,40 30,30" fill="none" stroke="currentColor" stroke-width="1" opacity="0.12"/></svg>' },
      { id: 'vin-4', name: 'Toile', svg: '<svg width="80" height="80"><ellipse cx="40" cy="30" rx="15" ry="20" fill="currentColor" opacity="0.08"/><path d="M25,50 Q40,45 55,50 Q40,55 25,50" fill="currentColor" opacity="0.06"/></svg>' },
      { id: 'vin-5', name: 'Retro Atomic', svg: '<svg width="60" height="60"><ellipse cx="30" cy="30" rx="20" ry="8" fill="none" stroke="currentColor" stroke-width="1" opacity="0.12"/><ellipse cx="30" cy="30" rx="20" ry="8" fill="none" stroke="currentColor" stroke-width="1" opacity="0.12" transform="rotate(60 30 30)"/><ellipse cx="30" cy="30" rx="20" ry="8" fill="none" stroke="currentColor" stroke-width="1" opacity="0.12" transform="rotate(120 30 30)"/><circle cx="30" cy="30" r="4" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'vin-6', name: '70s Flowers', svg: '<svg width="50" height="50"><circle cx="25" cy="25" r="6" fill="currentColor" opacity="0.15"/><ellipse cx="25" cy="10" rx="5" ry="8" fill="currentColor" opacity="0.1"/><ellipse cx="25" cy="10" rx="5" ry="8" fill="currentColor" opacity="0.1" transform="rotate(72 25 25)"/><ellipse cx="25" cy="10" rx="5" ry="8" fill="currentColor" opacity="0.1" transform="rotate(144 25 25)"/><ellipse cx="25" cy="10" rx="5" ry="8" fill="currentColor" opacity="0.1" transform="rotate(216 25 25)"/><ellipse cx="25" cy="10" rx="5" ry="8" fill="currentColor" opacity="0.1" transform="rotate(288 25 25)"/></svg>' }
    ]
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const color = searchParams.get('color') || '#000000';

  try {
    if (category && PATTERN_CATEGORIES[category as keyof typeof PATTERN_CATEGORIES]) {
      const cat = PATTERN_CATEGORIES[category as keyof typeof PATTERN_CATEGORIES];
      const patterns = cat.patterns.map(p => ({
        ...p,
        svg: p.svg.replace(/currentColor/g, color),
        dataUrl: `data:image/svg+xml,${encodeURIComponent(p.svg.replace(/currentColor/g, color))}`,
      }));
      return NextResponse.json({ success: true, category, name: cat.name, patterns, count: patterns.length });
    }

    if (search) {
      const searchLower = search.toLowerCase();
      const results: { id: string; name: string; svg: string; category: string; dataUrl: string }[] = [];
      Object.entries(PATTERN_CATEGORIES).forEach(([catKey, cat]) => {
        cat.patterns.forEach(pattern => {
          if (pattern.name.toLowerCase().includes(searchLower) || cat.name.toLowerCase().includes(searchLower)) {
            results.push({
              ...pattern, category: catKey,
              svg: pattern.svg.replace(/currentColor/g, color),
              dataUrl: `data:image/svg+xml,${encodeURIComponent(pattern.svg.replace(/currentColor/g, color))}`,
            });
          }
        });
      });
      return NextResponse.json({ success: true, search, results, count: results.length });
    }

    const categories = Object.entries(PATTERN_CATEGORIES).map(([key, cat]) => ({
      id: key, name: cat.name, count: cat.patterns.length,
      preview: cat.patterns.slice(0, 3).map(p => ({ id: p.id, name: p.name })),
    }));
    const totalPatterns = Object.values(PATTERN_CATEGORIES).reduce((acc, cat) => acc + cat.patterns.length, 0);
    return NextResponse.json({ success: true, categories, totalPatterns });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch patterns' }, { status: 500 });
  }
}
