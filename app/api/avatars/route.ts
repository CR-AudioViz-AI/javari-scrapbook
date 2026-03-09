// app/api/avatars/route.ts
// FREE Avatar Generation - Multiple Styles
// DiceBear (100% free, no API key), UI Avatars, Boring Avatars

import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// DiceBear styles (all free, no limits)
const DICEBEAR_STYLES = [
  { id: 'adventurer', name: 'Adventurer', description: 'Illustrated adventure characters' },
  { id: 'adventurer-neutral', name: 'Adventurer Neutral', description: 'Gender-neutral adventurers' },
  { id: 'avataaars', name: 'Avataaars', description: 'Cartoon avatar style' },
  { id: 'avataaars-neutral', name: 'Avataaars Neutral', description: 'Neutral cartoon avatars' },
  { id: 'big-ears', name: 'Big Ears', description: 'Cute big-eared characters' },
  { id: 'big-ears-neutral', name: 'Big Ears Neutral', description: 'Neutral big ears style' },
  { id: 'big-smile', name: 'Big Smile', description: 'Happy smiling faces' },
  { id: 'bottts', name: 'Bottts', description: 'Robot avatars' },
  { id: 'bottts-neutral', name: 'Bottts Neutral', description: 'Neutral robot style' },
  { id: 'croodles', name: 'Croodles', description: 'Hand-drawn doodle style' },
  { id: 'croodles-neutral', name: 'Croodles Neutral', description: 'Neutral doodles' },
  { id: 'fun-emoji', name: 'Fun Emoji', description: 'Playful emoji faces' },
  { id: 'icons', name: 'Icons', description: 'Simple icon avatars' },
  { id: 'identicon', name: 'Identicon', description: 'GitHub-style identicons' },
  { id: 'initials', name: 'Initials', description: 'Letter-based avatars' },
  { id: 'lorelei', name: 'Lorelei', description: 'Illustrated portraits' },
  { id: 'lorelei-neutral', name: 'Lorelei Neutral', description: 'Neutral portraits' },
  { id: 'micah', name: 'Micah', description: 'Modern illustrated style' },
  { id: 'miniavs', name: 'Miniavs', description: 'Mini avatar characters' },
  { id: 'notionists', name: 'Notionists', description: 'Notion-style avatars' },
  { id: 'notionists-neutral', name: 'Notionists Neutral', description: 'Neutral Notion style' },
  { id: 'open-peeps', name: 'Open Peeps', description: 'Hand-drawn illustrations' },
  { id: 'personas', name: 'Personas', description: 'Diverse character personas' },
  { id: 'pixel-art', name: 'Pixel Art', description: 'Retro pixel style' },
  { id: 'pixel-art-neutral', name: 'Pixel Art Neutral', description: 'Neutral pixel art' },
  { id: 'rings', name: 'Rings', description: 'Abstract ring patterns' },
  { id: 'shapes', name: 'Shapes', description: 'Geometric shape avatars' },
  { id: 'thumbs', name: 'Thumbs', description: 'Thumbs up characters' },
];

// Background color presets
const BACKGROUND_COLORS = [
  'b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf',
  'f4d35e', 'ee964b', 'f95738', '083d77', '2dc653',
  '7209b7', '3a0ca3', '4361ee', '4cc9f0', '06d6a0'
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const style = searchParams.get('style') || 'avataaars';
  const seed = searchParams.get('seed') || Math.random().toString(36).substring(7);
  const size = parseInt(searchParams.get('size') || '200');
  const background = searchParams.get('background');
  const format = searchParams.get('format') || 'svg'; // svg or png
  const count = Math.min(parseInt(searchParams.get('count') || '1'), 50);
  const listStyles = searchParams.get('listStyles');

  // Return available styles
  if (listStyles === 'true') {
    return NextResponse.json({
      styles: DICEBEAR_STYLES,
      backgroundColors: BACKGROUND_COLORS,
      usage: {
        baseUrl: 'https://api.dicebear.com/7.x/{style}/{format}',
        parameters: ['seed', 'size', 'backgroundColor', 'radius', 'scale'],
        example: '/api/avatars?style=avataaars&seed=john&size=200&count=10'
      }
    });
  }

  // Generate avatars
  const avatars = [];
  for (let i = 0; i < count; i++) {
    const avatarSeed = count > 1 ? `${seed}-${i}` : seed;
    const bg = background || BACKGROUND_COLORS[Math.floor(Math.random() * BACKGROUND_COLORS.length)];
    
    const url = `https://api.dicebear.com/7.x/${style}/${format}?seed=${encodeURIComponent(avatarSeed)}&size=${size}&backgroundColor=${bg}`;
    
    avatars.push({
      id: `avatar-${style}-${avatarSeed}`,
      url,
      style,
      seed: avatarSeed,
      size,
      backgroundColor: bg,
      format
    });
  }

  return NextResponse.json({
    avatars,
    total: avatars.length,
    style,
    provider: 'DiceBear',
    attribution: 'Avatars by DiceBear (https://dicebear.com) - Free for commercial use'
  });
}
