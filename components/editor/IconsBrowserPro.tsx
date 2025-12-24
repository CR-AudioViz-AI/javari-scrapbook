// components/editor/IconsBrowserPro.tsx
// Professional Icons Browser with Multiple Icon Libraries
// Timestamp: Tuesday, December 24, 2025 – 3:10 PM Eastern Time
// CR AudioViz AI - "Your Story. Our Design"

'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Shapes,
  Heart, 
  Star, 
  Home, 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Music,
  Sun,
  Moon,
  Cloud,
  Flower2,
  Gift,
  Cake,
  Baby,
  Plane,
  Car,
  Bike,
  Train,
  Ship,
  Anchor,
  Compass,
  Map,
  MapPin,
  Globe,
  Flag,
  Trophy,
  Medal,
  Award,
  Crown,
  Sparkles,
  Zap,
  Flame,
  Droplets,
  Wind,
  Snowflake,
  Umbrella,
  Rainbow,
  TreePine,
  Trees,
  Leaf,
  Apple,
  Cherry,
  Grape,
  Banana,
  Carrot,
  Cookie,
  Coffee,
  Wine,
  Beer,
  IceCream,
  Pizza,
  Utensils,
  ChefHat,
  Palette,
  Brush,
  Pencil,
  PenTool,
  Scissors,
  Ruler,
  Book,
  BookOpen,
  GraduationCap,
  School,
  Briefcase,
  Building,
  Building2,
  Landmark,
  Church,
  Tent,
  Mountain,
  Waves,
  Fish,
  Bird,
  Bug,
  Cat,
  Dog,
  Rabbit,
  Turtle,
  PawPrint,
  Gamepad2,
  Dice1,
  Puzzle,
  Volleyball,
  Football,
  Basketball,
  Dumbbell,
  Bike as BikeIcon,
  Shirt,
  Watch,
  Glasses,
  Diamond,
  Gem,
  Ring,
  Rocket,
  Satellite,
  Atom,
  Microscope,
  Stethoscope,
  Pill,
  Syringe,
  Thermometer,
  Bandage,
  HeartPulse
} from 'lucide-react';

interface IconItem {
  id: string;
  name: string;
  component: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  category: string;
  tags: string[];
}

interface IconsBrowserProProps {
  onSelectIcon?: (icon: IconItem) => void;
  onAddToCanvas?: (iconSvg: string, name: string) => void;
}

// Comprehensive icon library organized by category
const ICONS_LIBRARY: IconItem[] = [
  // LOVE & EMOTIONS
  { id: 'heart', name: 'Heart', component: Heart, category: 'emotions', tags: ['love', 'romance', 'valentine'] },
  { id: 'star', name: 'Star', component: Star, category: 'emotions', tags: ['favorite', 'rating', 'special'] },
  { id: 'sparkles', name: 'Sparkles', component: Sparkles, category: 'emotions', tags: ['magic', 'special', 'shine'] },
  { id: 'crown', name: 'Crown', component: Crown, category: 'emotions', tags: ['royal', 'king', 'queen'] },
  { id: 'diamond', name: 'Diamond', component: Diamond, category: 'emotions', tags: ['precious', 'gem', 'luxury'] },
  { id: 'gem', name: 'Gem', component: Gem, category: 'emotions', tags: ['jewel', 'precious', 'treasure'] },
  { id: 'ring', name: 'Ring', component: Ring, category: 'emotions', tags: ['wedding', 'engagement', 'jewelry'] },

  // HOME & FAMILY
  { id: 'home', name: 'Home', component: Home, category: 'family', tags: ['house', 'family', 'residence'] },
  { id: 'user', name: 'User', component: User, category: 'family', tags: ['person', 'profile', 'avatar'] },
  { id: 'baby', name: 'Baby', component: Baby, category: 'family', tags: ['child', 'infant', 'newborn'] },
  { id: 'cake', name: 'Cake', component: Cake, category: 'family', tags: ['birthday', 'celebration', 'party'] },
  { id: 'gift', name: 'Gift', component: Gift, category: 'family', tags: ['present', 'birthday', 'christmas'] },
  { id: 'trophy', name: 'Trophy', component: Trophy, category: 'family', tags: ['winner', 'achievement', 'award'] },
  { id: 'medal', name: 'Medal', component: Medal, category: 'family', tags: ['award', 'achievement', 'winner'] },
  { id: 'award', name: 'Award', component: Award, category: 'family', tags: ['ribbon', 'prize', 'achievement'] },

  // COMMUNICATION
  { id: 'mail', name: 'Mail', component: Mail, category: 'communication', tags: ['email', 'letter', 'message'] },
  { id: 'phone', name: 'Phone', component: Phone, category: 'communication', tags: ['call', 'mobile', 'contact'] },

  // NATURE & WEATHER
  { id: 'sun', name: 'Sun', component: Sun, category: 'nature', tags: ['sunny', 'day', 'summer'] },
  { id: 'moon', name: 'Moon', component: Moon, category: 'nature', tags: ['night', 'lunar', 'sleep'] },
  { id: 'cloud', name: 'Cloud', component: Cloud, category: 'nature', tags: ['weather', 'sky', 'cloudy'] },
  { id: 'snowflake', name: 'Snowflake', component: Snowflake, category: 'nature', tags: ['winter', 'cold', 'christmas'] },
  { id: 'umbrella', name: 'Umbrella', component: Umbrella, category: 'nature', tags: ['rain', 'weather', 'protection'] },
  { id: 'rainbow', name: 'Rainbow', component: Rainbow, category: 'nature', tags: ['colorful', 'hope', 'sky'] },
  { id: 'flame', name: 'Flame', component: Flame, category: 'nature', tags: ['fire', 'hot', 'burning'] },
  { id: 'droplets', name: 'Droplets', component: Droplets, category: 'nature', tags: ['water', 'rain', 'tears'] },
  { id: 'wind', name: 'Wind', component: Wind, category: 'nature', tags: ['breeze', 'air', 'weather'] },
  { id: 'zap', name: 'Zap', component: Zap, category: 'nature', tags: ['lightning', 'electric', 'power'] },

  // PLANTS & FLOWERS
  { id: 'flower', name: 'Flower', component: Flower2, category: 'plants', tags: ['bloom', 'garden', 'spring'] },
  { id: 'tree-pine', name: 'Pine Tree', component: TreePine, category: 'plants', tags: ['christmas', 'forest', 'winter'] },
  { id: 'trees', name: 'Trees', component: Trees, category: 'plants', tags: ['forest', 'nature', 'park'] },
  { id: 'leaf', name: 'Leaf', component: Leaf, category: 'plants', tags: ['autumn', 'nature', 'green'] },

  // FOOD & DRINKS
  { id: 'apple', name: 'Apple', component: Apple, category: 'food', tags: ['fruit', 'healthy', 'school'] },
  { id: 'cherry', name: 'Cherry', component: Cherry, category: 'food', tags: ['fruit', 'sweet', 'red'] },
  { id: 'grape', name: 'Grape', component: Grape, category: 'food', tags: ['fruit', 'wine', 'purple'] },
  { id: 'banana', name: 'Banana', component: Banana, category: 'food', tags: ['fruit', 'yellow', 'tropical'] },
  { id: 'carrot', name: 'Carrot', component: Carrot, category: 'food', tags: ['vegetable', 'healthy', 'orange'] },
  { id: 'cookie', name: 'Cookie', component: Cookie, category: 'food', tags: ['sweet', 'baking', 'treat'] },
  { id: 'coffee', name: 'Coffee', component: Coffee, category: 'food', tags: ['drink', 'morning', 'cafe'] },
  { id: 'wine', name: 'Wine', component: Wine, category: 'food', tags: ['drink', 'celebration', 'adult'] },
  { id: 'beer', name: 'Beer', component: Beer, category: 'food', tags: ['drink', 'celebration', 'adult'] },
  { id: 'ice-cream', name: 'Ice Cream', component: IceCream, category: 'food', tags: ['dessert', 'summer', 'treat'] },
  { id: 'pizza', name: 'Pizza', component: Pizza, category: 'food', tags: ['food', 'italian', 'party'] },
  { id: 'utensils', name: 'Utensils', component: Utensils, category: 'food', tags: ['dining', 'restaurant', 'eating'] },
  { id: 'chef-hat', name: 'Chef Hat', component: ChefHat, category: 'food', tags: ['cooking', 'kitchen', 'chef'] },

  // TRAVEL & TRANSPORT
  { id: 'plane', name: 'Airplane', component: Plane, category: 'travel', tags: ['flight', 'vacation', 'travel'] },
  { id: 'car', name: 'Car', component: Car, category: 'travel', tags: ['drive', 'road', 'transport'] },
  { id: 'bike', name: 'Bicycle', component: Bike, category: 'travel', tags: ['cycling', 'exercise', 'transport'] },
  { id: 'train', name: 'Train', component: Train, category: 'travel', tags: ['railway', 'transport', 'travel'] },
  { id: 'ship', name: 'Ship', component: Ship, category: 'travel', tags: ['boat', 'cruise', 'ocean'] },
  { id: 'anchor', name: 'Anchor', component: Anchor, category: 'travel', tags: ['nautical', 'marine', 'boat'] },
  { id: 'compass', name: 'Compass', component: Compass, category: 'travel', tags: ['navigation', 'direction', 'explore'] },
  { id: 'map', name: 'Map', component: Map, category: 'travel', tags: ['navigation', 'travel', 'location'] },
  { id: 'map-pin', name: 'Map Pin', component: MapPin, category: 'travel', tags: ['location', 'marker', 'place'] },
  { id: 'globe', name: 'Globe', component: Globe, category: 'travel', tags: ['world', 'earth', 'international'] },
  { id: 'flag', name: 'Flag', component: Flag, category: 'travel', tags: ['country', 'nation', 'marker'] },
  { id: 'tent', name: 'Tent', component: Tent, category: 'travel', tags: ['camping', 'outdoor', 'adventure'] },
  { id: 'mountain', name: 'Mountain', component: Mountain, category: 'travel', tags: ['hiking', 'nature', 'adventure'] },
  { id: 'waves', name: 'Waves', component: Waves, category: 'travel', tags: ['ocean', 'beach', 'water'] },

  // ANIMALS
  { id: 'fish', name: 'Fish', component: Fish, category: 'animals', tags: ['sea', 'aquatic', 'pet'] },
  { id: 'bird', name: 'Bird', component: Bird, category: 'animals', tags: ['flying', 'nature', 'twitter'] },
  { id: 'bug', name: 'Bug', component: Bug, category: 'animals', tags: ['insect', 'nature', 'ladybug'] },
  { id: 'cat', name: 'Cat', component: Cat, category: 'animals', tags: ['pet', 'feline', 'kitten'] },
  { id: 'dog', name: 'Dog', component: Dog, category: 'animals', tags: ['pet', 'canine', 'puppy'] },
  { id: 'rabbit', name: 'Rabbit', component: Rabbit, category: 'animals', tags: ['bunny', 'easter', 'pet'] },
  { id: 'turtle', name: 'Turtle', component: Turtle, category: 'animals', tags: ['slow', 'shell', 'reptile'] },
  { id: 'paw-print', name: 'Paw Print', component: PawPrint, category: 'animals', tags: ['pet', 'animal', 'track'] },

  // CREATIVE & ART
  { id: 'camera', name: 'Camera', component: Camera, category: 'creative', tags: ['photo', 'picture', 'photography'] },
  { id: 'music', name: 'Music', component: Music, category: 'creative', tags: ['song', 'audio', 'melody'] },
  { id: 'palette', name: 'Palette', component: Palette, category: 'creative', tags: ['art', 'paint', 'color'] },
  { id: 'brush', name: 'Brush', component: Brush, category: 'creative', tags: ['paint', 'art', 'drawing'] },
  { id: 'pencil', name: 'Pencil', component: Pencil, category: 'creative', tags: ['write', 'draw', 'edit'] },
  { id: 'pen-tool', name: 'Pen Tool', component: PenTool, category: 'creative', tags: ['design', 'vector', 'draw'] },
  { id: 'scissors', name: 'Scissors', component: Scissors, category: 'creative', tags: ['cut', 'craft', 'paper'] },
  { id: 'ruler', name: 'Ruler', component: Ruler, category: 'creative', tags: ['measure', 'straight', 'design'] },

  // EDUCATION
  { id: 'book', name: 'Book', component: Book, category: 'education', tags: ['read', 'library', 'study'] },
  { id: 'book-open', name: 'Open Book', component: BookOpen, category: 'education', tags: ['reading', 'study', 'learning'] },
  { id: 'graduation-cap', name: 'Graduation Cap', component: GraduationCap, category: 'education', tags: ['graduate', 'school', 'achievement'] },
  { id: 'school', name: 'School', component: School, category: 'education', tags: ['education', 'building', 'learn'] },

  // BUILDINGS
  { id: 'building', name: 'Building', component: Building, category: 'buildings', tags: ['office', 'city', 'urban'] },
  { id: 'building2', name: 'Building 2', component: Building2, category: 'buildings', tags: ['office', 'skyscraper', 'city'] },
  { id: 'landmark', name: 'Landmark', component: Landmark, category: 'buildings', tags: ['monument', 'bank', 'historic'] },
  { id: 'church', name: 'Church', component: Church, category: 'buildings', tags: ['religion', 'wedding', 'faith'] },
  { id: 'briefcase', name: 'Briefcase', component: Briefcase, category: 'buildings', tags: ['work', 'business', 'office'] },

  // SPORTS & GAMES
  { id: 'gamepad', name: 'Gamepad', component: Gamepad2, category: 'sports', tags: ['gaming', 'video', 'play'] },
  { id: 'dice', name: 'Dice', component: Dice1, category: 'sports', tags: ['game', 'gambling', 'luck'] },
  { id: 'puzzle', name: 'Puzzle', component: Puzzle, category: 'sports', tags: ['game', 'brain', 'solve'] },
  { id: 'volleyball', name: 'Volleyball', component: Volleyball, category: 'sports', tags: ['sport', 'beach', 'game'] },
  { id: 'football', name: 'Football', component: Football, category: 'sports', tags: ['sport', 'american', 'game'] },
  { id: 'dumbbell', name: 'Dumbbell', component: Dumbbell, category: 'sports', tags: ['gym', 'fitness', 'exercise'] },

  // FASHION
  { id: 'shirt', name: 'Shirt', component: Shirt, category: 'fashion', tags: ['clothing', 'clothes', 'tshirt'] },
  { id: 'watch', name: 'Watch', component: Watch, category: 'fashion', tags: ['time', 'accessory', 'wrist'] },
  { id: 'glasses', name: 'Glasses', component: Glasses, category: 'fashion', tags: ['eyewear', 'vision', 'fashion'] },

  // SCIENCE & TECH
  { id: 'rocket', name: 'Rocket', component: Rocket, category: 'science', tags: ['space', 'launch', 'startup'] },
  { id: 'satellite', name: 'Satellite', component: Satellite, category: 'science', tags: ['space', 'orbit', 'communication'] },
  { id: 'atom', name: 'Atom', component: Atom, category: 'science', tags: ['science', 'physics', 'molecule'] },
  { id: 'microscope', name: 'Microscope', component: Microscope, category: 'science', tags: ['science', 'research', 'lab'] },

  // HEALTH
  { id: 'stethoscope', name: 'Stethoscope', component: Stethoscope, category: 'health', tags: ['doctor', 'medical', 'health'] },
  { id: 'pill', name: 'Pill', component: Pill, category: 'health', tags: ['medicine', 'drug', 'pharmacy'] },
  { id: 'thermometer', name: 'Thermometer', component: Thermometer, category: 'health', tags: ['temperature', 'fever', 'health'] },
  { id: 'bandage', name: 'Bandage', component: Bandage, category: 'health', tags: ['wound', 'first-aid', 'medical'] },
  { id: 'heart-pulse', name: 'Heart Pulse', component: HeartPulse, category: 'health', tags: ['heartbeat', 'medical', 'health'] },
];

// Categories for filtering
const CATEGORIES = [
  { id: 'all', name: 'All Icons' },
  { id: 'emotions', name: 'Love & Emotions' },
  { id: 'family', name: 'Family' },
  { id: 'nature', name: 'Nature' },
  { id: 'plants', name: 'Plants' },
  { id: 'food', name: 'Food & Drinks' },
  { id: 'travel', name: 'Travel' },
  { id: 'animals', name: 'Animals' },
  { id: 'creative', name: 'Creative' },
  { id: 'education', name: 'Education' },
  { id: 'buildings', name: 'Buildings' },
  { id: 'sports', name: 'Sports' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'science', name: 'Science' },
  { id: 'health', name: 'Health' },
];

// Color options
const COLORS = [
  { id: 'black', value: '#1F2937' },
  { id: 'gray', value: '#6B7280' },
  { id: 'red', value: '#DC2626' },
  { id: 'orange', value: '#F97316' },
  { id: 'amber', value: '#F59E0B' },
  { id: 'green', value: '#22C55E' },
  { id: 'teal', value: '#14B8A6' },
  { id: 'blue', value: '#3B82F6' },
  { id: 'purple', value: '#8B5CF6' },
  { id: 'pink', value: '#EC4899' },
];

export default function IconsBrowserPro({ onSelectIcon, onAddToCanvas }: IconsBrowserProProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState('#1F2937');
  const [iconSize, setIconSize] = useState(24);

  // Filter icons
  const filteredIcons = useMemo(() => {
    return ICONS_LIBRARY.filter(icon => {
      const matchesSearch = searchQuery === '' || 
        icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Handle icon selection
  const handleIconSelect = (icon: IconItem) => {
    onSelectIcon?.(icon);
    // Generate SVG string for canvas
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${selectedColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon.name}</svg>`;
    onAddToCanvas?.(svgString, icon.name);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
            <Shapes className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Icons Pro</h3>
            <p className="text-xs text-gray-500">{filteredIcons.length} professional icons</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Color & Size */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {COLORS.map(color => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.value)}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${
                  selectedColor === color.value ? 'border-indigo-500 scale-110' : 'border-gray-200'
                }`}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-gray-500">Size:</span>
            <input
              type="range"
              min="16"
              max="48"
              value={iconSize}
              onChange={(e) => setIconSize(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-xs text-gray-600 w-8">{iconSize}px</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="p-2 border-b overflow-x-auto">
        <div className="flex gap-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Icons Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-6 gap-2">
          {filteredIcons.map(icon => {
            const IconComponent = icon.component;
            return (
              <button
                key={icon.id}
                onClick={() => handleIconSelect(icon)}
                className="aspect-square flex items-center justify-center p-2 rounded-lg border hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                title={icon.name}
              >
                <IconComponent 
                  className="transition-transform group-hover:scale-110" 
                  style={{ 
                    color: selectedColor,
                    width: Math.min(iconSize, 32),
                    height: Math.min(iconSize, 32)
                  }} 
                />
              </button>
            );
          })}
        </div>

        {filteredIcons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Shapes className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No icons found</p>
          </div>
        )}
      </div>
    </div>
  );
}
