'use client';

// javari Scrapbook - Premium Store Component
// Browse and purchase premium patterns, templates, and assets

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Star, Check, Crown, Sparkles, Lock, Heart,
  TrendingUp, Grid3X3, Palette, Frame, Type, Shapes, Gift,
  CreditCard, ChevronRight, X, Download, Eye
} from 'lucide-react';

interface PremiumItem {
  id: string;
  name: string;
  description: string;
  category: 'patterns' | 'templates' | 'stickers' | 'fonts' | 'frames' | 'bundles';
  price: number; // in credits
  preview: string;
  previewImages?: string[];
  rating: number;
  reviews: number;
  downloads: number;
  featured: boolean;
  isNew: boolean;
  tags: string[];
}

interface CartItem {
  item: PremiumItem;
  quantity: number;
}

// Premium content catalog
const premiumItems: PremiumItem[] = [
  // PREMIUM PATTERNS
  {
    id: 'pattern-watercolor-florals',
    name: 'Watercolor Florals Pack',
    description: '25 hand-painted watercolor floral patterns perfect for elegant scrapbooks',
    category: 'patterns',
    price: 50,
    preview: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    rating: 4.9,
    reviews: 156,
    downloads: 2340,
    featured: true,
    isNew: false,
    tags: ['floral', 'watercolor', 'elegant', 'feminine'],
  },
  {
    id: 'pattern-geometric-gold',
    name: 'Geometric Gold Collection',
    description: '30 luxurious gold geometric patterns with metallic effects',
    category: 'patterns',
    price: 65,
    preview: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #b38728 100%)',
    rating: 4.8,
    reviews: 89,
    downloads: 1567,
    featured: true,
    isNew: true,
    tags: ['geometric', 'gold', 'luxury', 'metallic'],
  },
  {
    id: 'pattern-vintage-damask',
    name: 'Vintage Damask Set',
    description: '20 classic damask patterns in various colorways',
    category: 'patterns',
    price: 40,
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    rating: 4.7,
    reviews: 234,
    downloads: 3456,
    featured: false,
    isNew: false,
    tags: ['vintage', 'damask', 'classic', 'ornate'],
  },
  {
    id: 'pattern-boho-tribal',
    name: 'Boho Tribal Patterns',
    description: '35 bohemian tribal patterns with earthy tones',
    category: 'patterns',
    price: 55,
    preview: 'linear-gradient(135deg, #d38312 0%, #a83279 100%)',
    rating: 4.8,
    reviews: 178,
    downloads: 2890,
    featured: false,
    isNew: false,
    tags: ['boho', 'tribal', 'earthy', 'ethnic'],
  },
  
  // PREMIUM TEMPLATES
  {
    id: 'template-wedding-elegant',
    name: 'Elegant Wedding Album',
    description: '12-page wedding scrapbook template with photo placeholders',
    category: 'templates',
    price: 80,
    preview: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    rating: 5.0,
    reviews: 312,
    downloads: 4567,
    featured: true,
    isNew: false,
    tags: ['wedding', 'elegant', 'romantic', 'photo-album'],
  },
  {
    id: 'template-baby-first-year',
    name: 'Baby\'s First Year',
    description: '24-page baby milestone template with monthly layouts',
    category: 'templates',
    price: 75,
    preview: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    rating: 4.9,
    reviews: 445,
    downloads: 6789,
    featured: true,
    isNew: false,
    tags: ['baby', 'milestones', 'first-year', 'cute'],
  },
  {
    id: 'template-travel-adventure',
    name: 'Travel Adventure Journal',
    description: '16-page travel journal template with maps and stamps',
    category: 'templates',
    price: 60,
    preview: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    rating: 4.8,
    reviews: 267,
    downloads: 3890,
    featured: false,
    isNew: true,
    tags: ['travel', 'adventure', 'journal', 'maps'],
  },
  
  // PREMIUM STICKER PACKS
  {
    id: 'stickers-kawaii-animals',
    name: 'Kawaii Animals Pack',
    description: '100+ adorable kawaii animal stickers with expressions',
    category: 'stickers',
    price: 35,
    preview: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    rating: 4.9,
    reviews: 567,
    downloads: 8901,
    featured: true,
    isNew: false,
    tags: ['kawaii', 'animals', 'cute', 'expressions'],
  },
  {
    id: 'stickers-holiday-mega',
    name: 'Holiday Mega Bundle',
    description: '500+ stickers for all major holidays throughout the year',
    category: 'stickers',
    price: 90,
    preview: 'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)',
    rating: 4.8,
    reviews: 389,
    downloads: 5678,
    featured: false,
    isNew: false,
    tags: ['holiday', 'christmas', 'halloween', 'easter'],
  },
  
  // PREMIUM FRAMES
  {
    id: 'frames-vintage-ornate',
    name: 'Vintage Ornate Frames',
    description: '50 decorative vintage frames with gold and silver variants',
    category: 'frames',
    price: 45,
    preview: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 100%)',
    rating: 4.7,
    reviews: 234,
    downloads: 3456,
    featured: false,
    isNew: false,
    tags: ['vintage', 'ornate', 'gold', 'decorative'],
  },
  
  // BUNDLES
  {
    id: 'bundle-ultimate-creator',
    name: 'Ultimate Creator Bundle',
    description: 'Everything you need: 200 patterns, 50 templates, 1000 stickers, 100 frames',
    category: 'bundles',
    price: 250,
    preview: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
    rating: 5.0,
    reviews: 189,
    downloads: 2345,
    featured: true,
    isNew: true,
    tags: ['bundle', 'complete', 'best-value', 'professional'],
  },
];

const categoryLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  patterns: { label: 'Patterns', icon: <Grid3X3 className="w-4 h-4" /> },
  templates: { label: 'Templates', icon: <Palette className="w-4 h-4" /> },
  stickers: { label: 'Stickers', icon: <Sparkles className="w-4 h-4" /> },
  fonts: { label: 'Fonts', icon: <Type className="w-4 h-4" /> },
  frames: { label: 'Frames', icon: <Frame className="w-4 h-4" /> },
  bundles: { label: 'Bundles', icon: <Gift className="w-4 h-4" /> },
};

export function PremiumStore() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PremiumItem | null>(null);
  const [userCredits] = useState(100); // This would come from user context
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-low' | 'price-high'>('popular');

  // Filter and sort items
  const filteredItems = premiumItems
    .filter(item => {
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        default: return b.downloads - a.downloads;
      }
    });

  const featuredItems = premiumItems.filter(item => item.featured);
  
  const addToCart = (item: PremiumItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev; // Already in cart
      }
      return [...prev, { item, quantity: 1 }];
    });
  };
  
  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(c => c.item.id !== itemId));
  };
  
  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const canAfford = userCredits >= cartTotal;

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-bold">Premium Store</h2>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-purple-900 text-xs font-bold rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
        
        {/* Credits balance */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="font-medium">{userCredits} Credits</span>
          </div>
          <button className="text-xs underline hover:no-underline">Get More</button>
        </div>
      </div>
      
      {/* Search & Filters */}
      <div className="px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <input
          type="text"
          placeholder="Search premium content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg border-0 focus:ring-2 focus:ring-purple-500"
        />
      </div>
      
      {/* Categories */}
      <div className="px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
              !selectedCategory 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            All
          </button>
          {Object.entries(categoryLabels).map(([key, { label, icon }]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap flex items-center gap-1 transition-colors ${
                selectedCategory === key 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Sort */}
      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800/50 flex items-center justify-between text-sm">
        <span className="text-gray-500">{filteredItems.length} items</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="text-sm bg-transparent border-0 text-gray-600 dark:text-gray-300 focus:ring-0"
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Featured Section */}
        {!selectedCategory && !searchQuery && (
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              Featured
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {featuredItems.slice(0, 3).map(item => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -2 }}
                  className="min-w-[200px] bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div 
                    className="h-24 relative"
                    style={{ background: item.preview }}
                  >
                    {item.isNew && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-gray-500">{item.rating}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-purple-600 font-bold text-sm">{item.price} Credits</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="p-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        <ShoppingCart className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* All Items Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div 
                className="h-20 relative"
                style={{ background: item.preview }}
              >
                {item.isNew && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded">
                    NEW
                  </span>
                )}
                {item.featured && (
                  <Crown className="absolute top-2 right-2 w-4 h-4 text-yellow-400" />
                )}
              </div>
              <div className="p-2">
                <h4 className="font-medium text-xs truncate">{item.name}</h4>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-[10px] text-gray-500">{item.rating} ({item.reviews})</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-purple-600 font-bold text-xs">{item.price} Cr</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                    className="p-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                  >
                    <ShoppingCart className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Cart Drawer */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold">Your Cart ({cart.length})</h3>
                <button onClick={() => setShowCart(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Your cart is empty</p>
                ) : (
                  <div className="space-y-3">
                    {cart.map(({ item }) => (
                      <div key={item.id} className="flex gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div 
                          className="w-12 h-12 rounded-lg"
                          style={{ background: item.preview }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-purple-600 font-bold text-sm">{item.price} Credits</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 dark:text-gray-300">Total</span>
                    <span className="font-bold text-lg">{cartTotal} Credits</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-500">Your Balance</span>
                    <span className={canAfford ? 'text-green-600' : 'text-red-600'}>{userCredits} Credits</span>
                  </div>
                  <button
                    disabled={!canAfford}
                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                      canAfford 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    {canAfford ? 'Purchase Now' : 'Insufficient Credits'}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col"
            >
              <div 
                className="h-40 relative"
                style={{ background: selectedItem.preview }}
              >
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur rounded-full hover:bg-white/30"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{selectedItem.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{selectedItem.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({selectedItem.reviews} reviews)</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{selectedItem.downloads.toLocaleString()} downloads</span>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{selectedItem.price} Credits</span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedItem.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedItem.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => { addToCart(selectedItem); setSelectedItem(null); }}
                    className="py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button className="py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PremiumStore;
