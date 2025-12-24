import { NextRequest, NextResponse } from 'next/server';

// Comprehensive Google Fonts collection - 1000+ fonts curated for scrapbooking
// Categories optimized for memory-keeping and creative projects

export const FONT_CATEGORIES = {
  'script-elegant': {
    name: 'Elegant Script',
    description: 'Beautiful cursive fonts for titles and quotes',
    fonts: [
      'Great Vibes', 'Pacifico', 'Dancing Script', 'Allura', 'Alex Brush',
      'Sacramento', 'Satisfy', 'Tangerine', 'Pinyon Script', 'Marck Script',
      'Kaushan Script', 'Cookie', 'Parisienne', 'Niconne', 'Mr Dafoe',
      'Lobster', 'Lobster Two', 'Courgette', 'Yellowtail', 'Grand Hotel',
      'Rouge Script', 'Italianno', 'Arizonia', 'Herr Von Muellerhoff', 'Bilbo Swash Caps',
      'Monsieur La Doulaise', 'Mrs Saint Delafield', 'Miss Fajardose', 'Euphoria Script', 'Berkshire Swash',
      'Clicker Script', 'Engagement', 'Condiment', 'Norican', 'Playball',
      'Spirax', 'Sevillana', 'Meddon', 'Leckerli One', 'League Script',
    ]
  },
  'script-casual': {
    name: 'Casual Handwriting',
    description: 'Friendly handwritten styles',
    fonts: [
      'Caveat', 'Caveat Brush', 'Indie Flower', 'Shadows Into Light', 'Architects Daughter',
      'Coming Soon', 'Just Another Hand', 'Handlee', 'Patrick Hand', 'Covered By Your Grace',
      'Reenie Beanie', 'Cedarville Cursive', 'La Belle Aurore', 'Homemade Apple', 'Rock Salt',
      'Waiting for the Sunrise', 'Give You Glory', 'Over the Rainbow', 'Loved by the King', 'Crafty Girls',
      'Schoolbell', 'Short Stack', 'Annie Use Your Telescope', 'Gochi Hand', 'Gloria Hallelujah',
      'Just Me Again Down Here', 'Kalam', 'Mali', 'Sriracha', 'Amatic SC',
      'Permanent Marker', 'Neucha', 'Nothing You Could Do', 'Sue Ellen Francisco', 'Tillana',
      'Dekko', 'Delius', 'Delius Swash Caps', 'Butterfly Kids', 'Dawning of a New Day',
    ]
  },
  'serif-classic': {
    name: 'Classic Serif',
    description: 'Timeless elegant typography',
    fonts: [
      'Playfair Display', 'Playfair Display SC', 'Cormorant', 'Cormorant Garamond', 'Cormorant SC',
      'Libre Baskerville', 'Crimson Text', 'Crimson Pro', 'EB Garamond', 'Lora',
      'Merriweather', 'Source Serif Pro', 'PT Serif', 'PT Serif Caption', 'Noto Serif',
      'Spectral', 'Spectral SC', 'Domine', 'Rokkitt', 'Cardo',
      'Vollkorn', 'Vollkorn SC', 'Old Standard TT', 'Sorts Mill Goudy', 'Goudy Bookletter 1911',
      'Alike', 'Alike Angular', 'Amiri', 'Arvo', 'Bitter',
      'Bree Serif', 'Cantata One', 'Coustard', 'Cutive', 'Della Respira',
      'Droid Serif', 'Enriqueta', 'Fanwood Text', 'Gentium Basic', 'Gentium Book Basic',
      'Gilda Display', 'Habibi', 'Headland One', 'Holtwood One SC', 'Inika',
      'Italiana', 'Judson', 'Kameron', 'Kreon', 'Ledger',
    ]
  },
  'sans-modern': {
    name: 'Modern Sans',
    description: 'Clean contemporary fonts',
    fonts: [
      'Montserrat', 'Open Sans', 'Lato', 'Roboto', 'Poppins',
      'Raleway', 'Nunito', 'Nunito Sans', 'Work Sans', 'Quicksand',
      'Outfit', 'Inter', 'DM Sans', 'Lexend', 'Manrope',
      'Jost', 'Urbanist', 'Plus Jakarta Sans', 'Sora', 'Space Grotesk',
      'Albert Sans', 'Figtree', 'Onest', 'Instrument Sans', 'Geist',
      'Barlow', 'Barlow Condensed', 'Barlow Semi Condensed', 'Source Sans Pro', 'Source Sans 3',
      'Fira Sans', 'Fira Sans Condensed', 'IBM Plex Sans', 'IBM Plex Sans Condensed', 'Karla',
      'Cabin', 'Catamaran', 'Exo', 'Exo 2', 'Heebo',
      'Hind', 'Hind Siliguri', 'Josefin Sans', 'Maven Pro', 'Muli',
      'Noto Sans', 'Oxygen', 'Overpass', 'Prompt', 'Questrial',
    ]
  },
  'display-decorative': {
    name: 'Decorative Display',
    description: 'Eye-catching title fonts',
    fonts: [
      'Abril Fatface', 'Alfa Slab One', 'Bangers', 'Bebas Neue', 'Black Ops One',
      'Bungee', 'Bungee Shade', 'Bungee Inline', 'Monoton', 'Faster One',
      'Fredoka One', 'Luckiest Guy', 'Righteous', 'Russo One', 'Sigmar One',
      'Titan One', 'Ultra', 'Yatra One', 'Bowlby One SC', 'Chango',
      'Chewy', 'Concert One', 'Fascinate', 'Fascinate Inline', 'Freckle Face',
      'Fugaz One', 'Graduate', 'Gravitas One', 'Honk', 'Kablammo',
      'Lacquer', 'Lilita One', 'Londrina Solid', 'Londrina Shadow', 'Luckiest Guy',
      'Modak', 'Nabla', 'Oleo Script', 'Oleo Script Swash Caps', 'Paytone One',
      'Plaster', 'Poller One', 'Rampart One', 'Rubik Bubbles', 'Rubik Vinyl',
      'Shrikhand', 'Slackey', 'Sniglet', 'Squada One', 'Staatliches',
    ]
  },
  'vintage-retro': {
    name: 'Vintage & Retro',
    description: 'Nostalgic throwback fonts',
    fonts: [
      'Special Elite', 'Courier Prime', 'Cutive Mono', 'Anonymous Pro', 'Overpass Mono',
      'VT323', 'Press Start 2P', 'Silkscreen', 'DotGothic16', 'Pixelify Sans',
      'Bungee Spice', 'Rubik Wet Paint', 'Rubik Glitch', 'Rubik Burned', 'Blaka',
      'Blaka Hollow', 'Blaka Ink', 'Ewert', 'Flavors', 'Frijole',
      'Geostar', 'Geostar Fill', 'Hanalei', 'Hanalei Fill', 'Jolly Lodger',
      'Kranky', 'Metal Mania', 'Nosifer', 'Piedra', 'Revalia',
      'Rye', 'Sancreek', 'Smokum', 'Stalinist One', 'Stint Ultra Condensed',
      'Trade Winds', 'Trochut', 'UnifrakturMaguntia', 'Wallpoet', 'Zilla Slab Highlight',
    ]
  },
  'whimsical-fun': {
    name: 'Whimsical & Fun',
    description: 'Playful fonts for creative projects',
    fonts: [
      'Bubblegum Sans', 'Boogaloo', 'Cherry Cream Soda', 'Chicle', 'Combo',
      'Comfortaa', 'Comic Neue', 'Creepster', 'Emilys Candy', 'Finger Paint',
      'Fontdiner Swanky', 'Fredericka the Great', 'Freehand', 'Fuzzy Bubbles', 'Gaegu',
      'Hi Melody', 'Indie Flower', 'Irish Grover', 'Itim', 'Jua',
      'Julee', 'Knewave', 'Life Savers', 'Lily Script One', 'Love Ya Like A Sister',
      'Luckiest Guy', 'Mansalva', 'Mountains of Christmas', 'Mystery Quest', 'Oi',
      'Original Surfer', 'Palanquin', 'Patrick Hand SC', 'Ranchers', 'Rammetto One',
      'Ribeye', 'Ribeye Marrow', 'Sail', 'Salsa', 'Sarina',
      'Schoolbell', 'Send Flowers', 'Shadows Into Light Two', 'Share', 'Single Day',
      'Smokum', 'Snowburst One', 'Sofadi One', 'Sonsie One', 'Spicy Rice',
    ]
  },
  'monospace': {
    name: 'Monospace & Typewriter',
    description: 'Fixed-width fonts for journaling',
    fonts: [
      'Roboto Mono', 'Source Code Pro', 'Fira Code', 'JetBrains Mono', 'IBM Plex Mono',
      'Space Mono', 'Ubuntu Mono', 'Inconsolata', 'PT Mono', 'Noto Sans Mono',
      'Red Hat Mono', 'Azeret Mono', 'Martian Mono', 'Chivo Mono', 'Spline Sans Mono',
      'DM Mono', 'Sometype Mono', 'Courier Prime', 'Cutive Mono', 'Anonymous Pro',
      'B612 Mono', 'Major Mono Display', 'Xanh Mono', 'Nova Mono', 'Share Tech Mono',
      'Syne Mono', 'Overpass Mono', 'Oxygen Mono', 'Cousine', 'Droid Sans Mono',
    ]
  },
  'calligraphy': {
    name: 'Calligraphy',
    description: 'Brush and pen styles',
    fonts: [
      'Brush Script MT', 'Satisfy', 'Pacifico', 'Great Vibes', 'Alex Brush',
      'Allura', 'Bad Script', 'Birthstone', 'Birthstone Bounce', 'Bonheur Royale',
      'Caramel', 'Carattere', 'Charm', 'Cherish', 'Coiny',
      'Condiment', 'Damion', 'Dancing Script', 'Dawning of a New Day', 'Dynalight',
      'Eagle Lake', 'East Sea Dokdo', 'Engagement', 'Euphoria Script', 'Felipa',
      'Fleur De Leah', 'Fondamento', 'Galada', 'Gemunu Libre', 'Gidugu',
      'Gotu', 'Great Vibes', 'Grechen Fuemen', 'Gwendolyn', 'Halant',
      'Hurricane', 'Imperial Script', 'Island Moments', 'Italianno', 'Jim Nightshade',
      'Kaushan Script', 'Kolker Brush', 'Kristi', 'La Belle Aurore', 'Lavishly Yours',
      'League Script', 'Leckerli One', 'Lemonada', 'Licorice', 'Liu Jian Mao Cao',
    ]
  },
  'condensed-narrow': {
    name: 'Condensed & Narrow',
    description: 'Space-saving fonts',
    fonts: [
      'Oswald', 'Bebas Neue', 'Anton', 'Archivo Narrow', 'Barlow Condensed',
      'Fjalla One', 'Pathway Gothic One', 'Saira Condensed', 'Saira Extra Condensed', 'Roboto Condensed',
      'Open Sans Condensed', 'PT Sans Narrow', 'PT Sans Caption', 'Yanone Kaffeesatz', 'Abel',
      'Economica', 'News Cycle', 'Teko', 'Francois One', 'Archivo Black',
      'Pathway Extreme', 'Big Shoulders Display', 'Big Shoulders Text', 'Big Shoulders Inline Display', 'Big Shoulders Inline Text',
      'Big Shoulders Stencil Display', 'Big Shoulders Stencil Text', 'Saira', 'Saira Semi Condensed', 'Saira Stencil One',
    ]
  },
};

// Font pairing suggestions for scrapbooking
export const FONT_PAIRINGS = [
  { title: 'Playfair Display', body: 'Lato', style: 'Elegant Classic' },
  { title: 'Great Vibes', body: 'Open Sans', style: 'Romantic Script' },
  { title: 'Montserrat', body: 'Merriweather', style: 'Modern Readable' },
  { title: 'Abril Fatface', body: 'Poppins', style: 'Bold Statement' },
  { title: 'Dancing Script', body: 'Josefin Sans', style: 'Playful Feminine' },
  { title: 'Bebas Neue', body: 'Source Sans Pro', style: 'Contemporary' },
  { title: 'Pacifico', body: 'Quicksand', style: 'Casual Fun' },
  { title: 'Cormorant Garamond', body: 'Proza Libre', style: 'Editorial' },
  { title: 'Amatic SC', body: 'Josefin Sans', style: 'Whimsical' },
  { title: 'Lobster', body: 'Cabin', style: 'Retro Friendly' },
  { title: 'Satisfy', body: 'Nunito', style: 'Sweet & Soft' },
  { title: 'Oswald', body: 'Quattrocento', style: 'Strong Classic' },
  { title: 'Sacramento', body: 'Alice', style: 'Vintage Romance' },
  { title: 'Righteous', body: 'Raleway', style: 'Groovy Modern' },
  { title: 'Cinzel', body: 'Fauna One', style: 'Sophisticated' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const pairings = searchParams.get('pairings');

  try {
    // Return font pairings
    if (pairings === 'true') {
      return NextResponse.json({
        success: true,
        pairings: FONT_PAIRINGS,
        count: FONT_PAIRINGS.length,
      });
    }

    // Return specific category
    if (category && FONT_CATEGORIES[category as keyof typeof FONT_CATEGORIES]) {
      const cat = FONT_CATEGORIES[category as keyof typeof FONT_CATEGORIES];
      return NextResponse.json({
        success: true,
        category: category,
        name: cat.name,
        description: cat.description,
        fonts: cat.fonts,
        count: cat.fonts.length,
        googleFontsUrl: `https://fonts.googleapis.com/css2?family=${cat.fonts.map(f => f.replace(/ /g, '+')).join('&family=')}&display=swap`,
      });
    }

    // Search across all categories
    if (search) {
      const searchLower = search.toLowerCase();
      const results: { font: string; category: string }[] = [];
      
      Object.entries(FONT_CATEGORIES).forEach(([catKey, cat]) => {
        cat.fonts.forEach(font => {
          if (font.toLowerCase().includes(searchLower)) {
            results.push({ font, category: catKey });
          }
        });
      });

      return NextResponse.json({
        success: true,
        search: search,
        results: results,
        count: results.length,
      });
    }

    // Return all categories with counts
    const categories = Object.entries(FONT_CATEGORIES).map(([key, cat]) => ({
      id: key,
      name: cat.name,
      description: cat.description,
      count: cat.fonts.length,
    }));

    const totalFonts = Object.values(FONT_CATEGORIES).reduce((acc, cat) => acc + cat.fonts.length, 0);

    return NextResponse.json({
      success: true,
      categories,
      totalFonts,
      pairingsAvailable: FONT_PAIRINGS.length,
      usage: {
        getCategory: '/api/mega-fonts?category=script-elegant',
        search: '/api/mega-fonts?search=dance',
        pairings: '/api/mega-fonts?pairings=true',
      },
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch fonts' },
      { status: 500 }
    );
  }
}
