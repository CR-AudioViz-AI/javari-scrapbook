import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FONT_CATEGORIES = {
  'script-elegant': {
    name: 'Elegant Script',
    description: 'Beautiful cursive fonts for titles and quotes',
    fonts: [
      'Great Vibes', 'Pacifico', 'Dancing Script', 'Allura', 'Alex Brush',
      'Sacramento', 'Satisfy', 'Tangerine', 'Pinyon Script', 'Marck Script',
      'Kaushan Script', 'Cookie', 'Parisienne', 'Niconne', 'Mr Dafoe',
      'Lobster', 'Lobster Two', 'Courgette', 'Yellowtail', 'Grand Hotel',
      'Herr Von Muellerhoff', 'Monsieur La Doulaise', 'Mrs Saint Delafield',
      'Seaweed Script', 'Italianno', 'Rouge Script', 'Bilbo Swash Caps',
      'Euphoria Script', 'Petit Formal Script', 'Berkshire Swash',
      'Sofia', 'Aguafina Script', 'Clicker Script', 'Condiment', 'Dynalight',
      'Engagement', 'Felipa', 'Fondamento', 'Jim Nightshade', 'Julee',
      'Meie Script', 'Meddon', 'Miama', 'Norican', 'Oleo Script',
      'Playball', 'Ruthie', 'Sail', 'Spirax', 'Stalemate'
    ]
  },
  'script-casual': {
    name: 'Casual Handwriting',
    description: 'Friendly handwritten styles for journaling',
    fonts: [
      'Caveat', 'Caveat Brush', 'Indie Flower', 'Shadows Into Light', 'Architects Daughter',
      'Coming Soon', 'Just Another Hand', 'Handlee', 'Patrick Hand', 'Covered By Your Grace',
      'Reenie Beanie', 'Gloria Hallelujah', 'Schoolbell', 'Short Stack', 'Gochi Hand',
      'Kalam', 'Kristi', 'La Belle Aurore', 'Loved by the King', 'Nanum Pen Script',
      'Nothing You Could Do', 'Over the Rainbow', 'Permanent Marker', 'Rock Salt', 'Shadows Into Light Two',
      'Swanky and Moo Moo', 'The Girl Next Door', 'Waiting for the Sunrise', 'Zeyada', 'Annie Use Your Telescope',
      'Amatic SC', 'Beth Ellen', 'Cabin Sketch', 'Cedarville Cursive', 'Dawning of a New Day',
      'Dekko', 'Delius', 'Delius Swash Caps', 'Delius Unicase', 'Donegal One',
      'Give You Glory', 'Henny Penny', 'Homemade Apple', 'League Script', 'Mali',
      'Mansalva', 'Merienda', 'Merienda One', 'Mr De Haviland', 'Neucha'
    ]
  },
  'serif-classic': {
    name: 'Classic Serif',
    description: 'Timeless elegant typography',
    fonts: [
      'Playfair Display', 'Cormorant', 'Cormorant Garamond', 'Libre Baskerville', 'Crimson Text',
      'EB Garamond', 'Lora', 'Merriweather', 'Source Serif Pro', 'PT Serif',
      'Noto Serif', 'Spectral', 'Domine', 'Rokkitt', 'Cardo',
      'Alegreya', 'Amiri', 'Arvo', 'Bitter', 'Bree Serif',
      'Coustard', 'Droid Serif', 'Eczar', 'Faustina', 'Frank Ruhl Libre',
      'Gelasio', 'Gentium Basic', 'Gentium Book Basic', 'Gilda Display', 'Habibi',
      'Headland One', 'IBM Plex Serif', 'Inknut Antiqua', 'Judson', 'Kameron',
      'Karma', 'Kreon', 'Kurale', 'Laila', 'Libre Caslon Text',
      'Literata', 'Lora', 'Lusitana', 'Martel', 'Mate',
      'Neuton', 'Noticia Text', 'Old Standard TT', 'Oranienbaum', 'Petrona'
    ]
  },
  'sans-modern': {
    name: 'Modern Sans-Serif',
    description: 'Clean contemporary fonts',
    fonts: [
      'Montserrat', 'Open Sans', 'Lato', 'Roboto', 'Poppins',
      'Raleway', 'Nunito', 'Work Sans', 'Quicksand', 'Inter',
      'DM Sans', 'Lexend', 'Manrope', 'Jost', 'Urbanist',
      'Rubik', 'Karla', 'Nunito Sans', 'Source Sans Pro', 'Fira Sans',
      'Barlow', 'Cabin', 'Catamaran', 'Exo 2', 'Hind',
      'IBM Plex Sans', 'Josefin Sans', 'Kanit', 'Mukta', 'Noto Sans',
      'Overpass', 'Oxygen', 'Palanquin', 'Play', 'Prompt',
      'PT Sans', 'Questrial', 'Rajdhani', 'Red Hat Display', 'Sarabun',
      'Signika', 'Tajawal', 'Teko', 'Titillium Web', 'Ubuntu',
      'Varela Round', 'Yantramanav', 'Zen Kaku Gothic New', 'Assistant', 'Heebo'
    ]
  },
  'display-decorative': {
    name: 'Display & Decorative',
    description: 'Eye-catching fonts for titles and headers',
    fonts: [
      'Abril Fatface', 'Alfa Slab One', 'Bangers', 'Bebas Neue', 'Black Ops One',
      'Bungee', 'Fredoka One', 'Luckiest Guy', 'Righteous', 'Russo One',
      'Anton', 'Archivo Black', 'Asap', 'Bowlby One SC', 'Bree Serif',
      'Carter One', 'Changa One', 'Chango', 'Chela One', 'Chewy',
      'Chicle', 'Concert One', 'Contrail One', 'Coiny', 'Coda',
      'Dela Gothic One', 'Diplomata', 'Diplomata SC', 'Dokdo', 'Doppio One',
      'Emblema One', 'Encode Sans', 'Ewert', 'Faster One', 'Fira Sans Condensed',
      'Fjalla One', 'Flamenco', 'Fugaz One', 'Graduate', 'Gravitas One',
      'Hammersmith One', 'Holtwood One SC', 'Iceland', 'Irish Grover', 'Jockey One',
      'Jolly Lodger', 'Jomhuria', 'Jomolhari', 'Josefin Slab', 'Jua'
    ]
  },
  'vintage-retro': {
    name: 'Vintage & Retro',
    description: 'Nostalgic throwback fonts',
    fonts: [
      'Special Elite', 'Courier Prime', 'VT323', 'Press Start 2P', 'Silkscreen',
      'Cutive Mono', 'Nova Mono', 'Overpass Mono', 'Share Tech Mono', 'Anonymous Pro',
      'Redressed', 'Rochester', 'Rye', 'Sail', 'Sancreek',
      'Sevillana', 'Shrikhand', 'Six Caps', 'Sonsie One', 'Squada One',
      'Staatliches', 'Stardos Stencil', 'Stint Ultra Condensed', 'Stint Ultra Expanded', 'Sue Ellen Francisco',
      'Sunshiney', 'Supermercado One', 'Suwannaphum', 'Syncopate', 'Tangerine',
      'Titan One', 'Trade Winds', 'Trirong', 'Trocchi', 'Trochut',
      'Tulpen One', 'Ubuntu Condensed', 'Ultra', 'Uncial Antiqua', 'Underdog',
      'Unica One', 'UnifrakturCook', 'UnifrakturMaguntia', 'Unkempt', 'Unlock'
    ]
  },
  'whimsical-fun': {
    name: 'Whimsical & Fun',
    description: 'Playful fonts for creative projects',
    fonts: [
      'Bubblegum Sans', 'Boogaloo', 'Cherry Cream Soda', 'Comfortaa', 'Comic Neue',
      'Finger Paint', 'Fuzzy Bubbles', 'Gaegu', 'Itim', 'Life Savers',
      'Londrina Outline', 'Londrina Shadow', 'Londrina Sketch', 'Londrina Solid', 'Love Ya Like A Sister',
      'Luckiest Guy', 'Macondo', 'Macondo Swash Caps', 'Mada', 'Magra',
      'Mali', 'Mallanna', 'Mandali', 'Marcellus', 'Marcellus SC',
      'Margarine', 'Marmelad', 'Marvel', 'Mate SC', 'Maven Pro',
      'McLaren', 'Meddon', 'MedievalSharp', 'Medula One', 'Meera Inimai',
      'Megrim', 'Meie Script', 'Merienda', 'Merienda One', 'Merriweather Sans',
      'Metal', 'Metal Mania', 'Metamorphous', 'Metrophobic', 'Michroma',
      'Patrick Hand SC', 'Ranchers', 'Rammetto One', 'Sniglet', 'Titan One'
    ]
  },
  'monospace': {
    name: 'Monospace',
    description: 'Fixed-width fonts for journaling and lists',
    fonts: [
      'Roboto Mono', 'Source Code Pro', 'Fira Code', 'JetBrains Mono', 'IBM Plex Mono',
      'Space Mono', 'Ubuntu Mono', 'Inconsolata', 'PT Mono', 'Noto Sans Mono',
      'Cousine', 'Anonymous Pro', 'Cutive Mono', 'Nova Mono', 'Overpass Mono',
      'Share Tech Mono', 'B612 Mono', 'DM Mono', 'Major Mono Display', 'Azeret Mono',
      'Syne Mono', 'Xanh Mono', 'Victor Mono', 'Courier Prime', 'Red Hat Mono'
    ]
  },
  'condensed': {
    name: 'Condensed & Narrow',
    description: 'Space-saving fonts for tight layouts',
    fonts: [
      'Oswald', 'Barlow Condensed', 'Roboto Condensed', 'Fira Sans Condensed', 'Open Sans Condensed',
      'PT Sans Narrow', 'Saira Condensed', 'Yanone Kaffeesatz', 'Abel', 'Pathway Gothic One',
      'Six Caps', 'Economica', 'Saira Extra Condensed', 'Saira Semi Condensed', 'News Cycle',
      'Encode Sans Condensed', 'Encode Sans Semi Condensed', 'Antonio', 'Chivo', 'Cuprum',
      'Days One', 'Francois One', 'Gafata', 'Geo', 'Gruppo'
    ]
  },
  'calligraphy': {
    name: 'Calligraphy & Brush',
    description: 'Artistic brush and calligraphy styles',
    fonts: [
      'Arizonia', 'Bad Script', 'Calligraffitti', 'Carattere', 'Charm',
      'Corinthia', 'Damion', 'Dr Sugiyama', 'East Sea Dokdo', 'Fleur De Leah',
      'Fuzzy Bubbles', 'Grape Nuts', 'Great Vibes', 'Herr Von Muellerhoff', 'Hurricane',
      'Imperial Script', 'Inspiration', 'Island Moments', 'Italianno', 'Kaushan Script',
      'Licorice', 'Luxurious Script', 'Meow Script', 'Merienda', 'Miss Fajardose',
      'Monsieur La Doulaise', 'Montez', 'Moon Dance', 'Mrs Saint Delafield', 'Ms Madi',
      'Nanum Brush Script', 'Niconne', 'Norican', 'Nothing You Could Do', 'Oleo Script',
      'Oleo Script Swash Caps', 'Ole', 'Oooh Baby', 'Pacifico', 'Parisienne'
    ]
  }
};

const FONT_PAIRINGS = [
  { title: 'Playfair Display', body: 'Lato', style: 'Elegant Classic' },
  { title: 'Great Vibes', body: 'Open Sans', style: 'Romantic Script' },
  { title: 'Montserrat', body: 'Merriweather', style: 'Modern Readable' },
  { title: 'Abril Fatface', body: 'Poppins', style: 'Bold Statement' },
  { title: 'Dancing Script', body: 'Quicksand', style: 'Playful Feminine' },
  { title: 'Oswald', body: 'Quattrocento', style: 'Strong Editorial' },
  { title: 'Pacifico', body: 'Josefin Sans', style: 'Beach Casual' },
  { title: 'Cinzel', body: 'Fauna One', style: 'Luxurious Formal' },
  { title: 'Amatic SC', body: 'Josefin Sans', style: 'Whimsical Friendly' },
  { title: 'Lobster', body: 'Cabin', style: 'Fun Retro' },
  { title: 'Sacramento', body: 'Alice', style: 'Wedding Elegance' },
  { title: 'Righteous', body: 'Raleway', style: 'Modern Bold' },
  { title: 'Permanent Marker', body: 'Open Sans', style: 'Casual Fun' },
  { title: 'Yeseva One', body: 'Crimson Text', style: 'Classic Beauty' },
  { title: 'Bungee', body: 'DM Sans', style: 'Urban Modern' }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const pairings = searchParams.get('pairings');

  try {
    if (pairings === 'true') {
      return NextResponse.json({ success: true, pairings: FONT_PAIRINGS, count: FONT_PAIRINGS.length });
    }

    if (category && FONT_CATEGORIES[category as keyof typeof FONT_CATEGORIES]) {
      const cat = FONT_CATEGORIES[category as keyof typeof FONT_CATEGORIES];
      const googleUrl = `https://fonts.googleapis.com/css2?family=${cat.fonts.slice(0, 20).map(f => f.replace(/ /g, '+')).join('&family=')}&display=swap`;
      return NextResponse.json({
        success: true, category, name: cat.name, description: cat.description,
        fonts: cat.fonts, count: cat.fonts.length, googleFontsUrl: googleUrl,
      });
    }

    if (search) {
      const searchLower = search.toLowerCase();
      const results: { font: string; category: string; categoryName: string }[] = [];
      Object.entries(FONT_CATEGORIES).forEach(([catKey, cat]) => {
        cat.fonts.forEach(font => {
          if (font.toLowerCase().includes(searchLower)) {
            results.push({ font, category: catKey, categoryName: cat.name });
          }
        });
      });
      return NextResponse.json({ success: true, search, results, count: results.length });
    }

    const categories = Object.entries(FONT_CATEGORIES).map(([key, cat]) => ({
      id: key, name: cat.name, description: cat.description, count: cat.fonts.length,
      preview: cat.fonts.slice(0, 5),
    }));
    const totalFonts = Object.values(FONT_CATEGORIES).reduce((acc, cat) => acc + cat.fonts.length, 0);
    return NextResponse.json({ success: true, categories, totalFonts, pairingsAvailable: FONT_PAIRINGS.length });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch fonts' }, { status: 500 });
  }
}
