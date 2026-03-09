// app/api/placeholder-text/route.ts
// Placeholder Text Generator
// Lorem ipsum and themed text for scrapbook captions

import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const LOREM_WORDS = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'];

const THEMED_PHRASES: Record<string, string[]> = {
  family: [
    'Forever grateful for these moments',
    'Making memories that last a lifetime',
    'Family is everything',
    'Together is our favorite place to be',
    'The love of a family is life\'s greatest blessing',
    'Creating our happily ever after',
    'Home is where our story begins',
    'These are the days we\'ll remember',
  ],
  baby: [
    'Ten tiny fingers, ten tiny toes',
    'You are my sunshine',
    'Dream big little one',
    'Loved beyond measure',
    'Our little miracle',
    'Welcome to the world',
    'Watch me grow',
    'Sweet baby dreams',
  ],
  wedding: [
    'And so the adventure begins',
    'Two hearts, one love',
    'Forever starts today',
    'All you need is love',
    'Happily ever after',
    'Best day ever',
    'Love is all you need',
    'Written in the stars',
  ],
  travel: [
    'Adventure awaits',
    'Wander often, wonder always',
    'Collect moments, not things',
    'Life is short, travel more',
    'Explore dream discover',
    'The world is yours',
    'Find your wild',
    'Go where you feel most alive',
  ],
  birthday: [
    'Make a wish',
    'Another year older, another year wiser',
    'Party time!',
    'Celebrate good times',
    'Here\'s to another year',
    'Cheers to you',
    'Growing up is optional',
    'Best birthday ever',
  ],
  friendship: [
    'Friends are the family we choose',
    'Side by side or miles apart',
    'Better together',
    'Good times and crazy friends',
    'Making memories with you',
    'True friends are forever',
    'Squad goals',
    'Adventures with friends',
  ],
  graduation: [
    'She believed she could, so she did',
    'The tassel was worth the hassle',
    'Dream big, work hard',
    'New beginnings',
    'Class of excellence',
    'The future is bright',
    'Onwards and upwards',
    'Next chapter starts now',
  ],
  nature: [
    'Let nature be your guide',
    'Into the wild',
    'Find me where the wild things are',
    'Nature is not a place to visit',
    'Every flower is a soul blossoming',
    'In every walk with nature',
    'Stop and smell the flowers',
    'Sunshine on my mind',
  ],
};

const QUOTES: string[] = [
  '"The best things in life are the people you love, the places you\'ve been, and the memories you\'ve made along the way."',
  '"Life is not measured by the breaths we take, but by the moments that take our breath away."',
  '"In the end, we only regret the chances we didn\'t take."',
  '"The purpose of life is to live it, to taste experience to the utmost."',
  '"Every moment is a fresh beginning."',
  '"Create the life you can\'t wait to wake up to."',
  '"Life is short. Make every hair flip count."',
  '"Be yourself; everyone else is already taken."',
];

function generateLorem(words: number): string {
  const result: string[] = [];
  for (let i = 0; i < words; i++) {
    result.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  }
  // Capitalize first letter
  result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);
  return result.join(' ') + '.';
}

function generateSentences(count: number): string {
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    const wordCount = Math.floor(Math.random() * 10) + 5; // 5-15 words
    sentences.push(generateLorem(wordCount));
  }
  return sentences.join(' ');
}

function generateParagraphs(count: number): string {
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    const sentenceCount = Math.floor(Math.random() * 3) + 3; // 3-6 sentences
    paragraphs.push(generateSentences(sentenceCount));
  }
  return paragraphs.join('\n\n');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'lorem';
  const words = parseInt(searchParams.get('words') || '50');
  const sentences = parseInt(searchParams.get('sentences') || '0');
  const paragraphs = parseInt(searchParams.get('paragraphs') || '0');
  const theme = searchParams.get('theme');
  const listThemes = searchParams.get('listThemes');

  // List available themes
  if (listThemes === 'true') {
    return NextResponse.json({
      themes: Object.keys(THEMED_PHRASES),
      usage: '/api/placeholder-text?theme=family'
    });
  }

  // Get themed phrases
  if (theme && THEMED_PHRASES[theme]) {
    const phrases = THEMED_PHRASES[theme];
    return NextResponse.json({
      theme,
      phrases,
      random: phrases[Math.floor(Math.random() * phrases.length)],
      all: phrases
    });
  }

  // Get random quote
  if (type === 'quote') {
    return NextResponse.json({
      quote: QUOTES[Math.floor(Math.random() * QUOTES.length)],
      allQuotes: QUOTES
    });
  }

  // Generate lorem ipsum
  let text = '';
  if (paragraphs > 0) {
    text = generateParagraphs(Math.min(paragraphs, 10));
  } else if (sentences > 0) {
    text = generateSentences(Math.min(sentences, 20));
  } else {
    text = generateLorem(Math.min(words, 500));
  }

  return NextResponse.json({
    text,
    type: paragraphs > 0 ? 'paragraphs' : sentences > 0 ? 'sentences' : 'words',
    count: paragraphs || sentences || words,
    themes: Object.keys(THEMED_PHRASES),
    usage: {
      lorem: '/api/placeholder-text?words=100',
      themed: '/api/placeholder-text?theme=wedding',
      quote: '/api/placeholder-text?type=quote'
    }
  });
}
