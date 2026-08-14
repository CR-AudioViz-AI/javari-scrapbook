'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Book, Search, Filter, ChevronRight, Star, Heart, Sparkles } from 'lucide-react'

const categories = [
  { id: 'all', name: 'All Templates' },
  { id: 'baby', name: 'Baby & Kids' },
  { id: 'wedding', name: 'Wedding' },
  { id: 'travel', name: 'Travel' },
  { id: 'family', name: 'Family' },
  { id: 'holiday', name: 'Holiday' },
  { id: 'pets', name: 'Pets' },
  { id: 'graduation', name: 'Graduation' },
  { id: 'birthday', name: 'Birthday' },
]

const templates = [
  { id: '1', name: 'Baby First Year', category: 'baby', emoji: '👶', pages: 24, premium: false, popular: true },
  { id: '2', name: 'Our Wedding Day', category: 'wedding', emoji: '💒', pages: 20, premium: true, popular: true },
  { id: '3', name: 'Travel Adventures', category: 'travel', emoji: '✈️', pages: 16, premium: false, popular: false },
  { id: '4', name: 'Family Heritage', category: 'family', emoji: '👨‍👩‍👧‍👦', pages: 30, premium: true, popular: false },
  { id: '5', name: 'Christmas Magic', category: 'holiday', emoji: '🎄', pages: 12, premium: false, popular: true },
  { id: '6', name: 'Pet Adventures', category: 'pets', emoji: '🐾', pages: 16, premium: false, popular: false },
  { id: '7', name: 'Graduation Day', category: 'graduation', emoji: '🎓', pages: 10, premium: false, popular: false },
  { id: '8', name: 'Birthday Bash', category: 'birthday', emoji: '🎂', pages: 8, premium: false, popular: true },
  { id: '9', name: 'Baby Shower', category: 'baby', emoji: '🍼', pages: 12, premium: true, popular: false },
  { id: '10', name: 'Honeymoon Memories', category: 'wedding', emoji: '💑', pages: 20, premium: true, popular: false },
  { id: '11', name: 'Road Trip', category: 'travel', emoji: '🚗', pages: 16, premium: false, popular: false },
  { id: '12', name: 'Summer Vacation', category: 'travel', emoji: '🏖️', pages: 14, premium: false, popular: true },
]

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPremium = !showPremiumOnly || t.premium
    return matchesCategory && matchesSearch && matchesPremium
  })

  return (
    <div className="min-h-screen bg-scrapbook-cream">
      {/* Header */}
      <header className="bg-white border-b border-scrapbook-washi/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-scrapbook-rose to-scrapbook-lavender flex items-center justify-center">
                <Book className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-2xl font-bold text-gray-800">JavariScrapbook</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-scrapbook-rose transition">
                Sign In
              </Link>
              <Link href="/signup" className="btn-scrapbook text-sm">
                Start Creating
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
            Template Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with a professionally designed template and make it uniquely yours
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-scrapbook-rose/30"
            />
          </div>
          <label className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 cursor-pointer">
            <input
              type="checkbox"
              checked={showPremiumOnly}
              onChange={(e) => setShowPremiumOnly(e.target.checked)}
              className="rounded border-gray-300 text-accent-gold focus:ring-accent-gold"
            />
            <Star className="w-4 h-4 text-accent-gold" />
            <span className="text-sm font-medium">Premium Only</span>
          </label>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === cat.id
                  ? 'bg-scrapbook-rose text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="card-scrapbook group cursor-pointer"
            >
              <div className="relative aspect-[3/4] bg-gradient-to-br from-scrapbook-rose/10 to-scrapbook-lavender/10 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                <span className="text-6xl group-hover:scale-110 transition-transform">{template.emoji}</span>
                {template.premium && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-accent-gold text-white text-xs font-medium rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Premium
                  </div>
                )}
                {template.popular && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-scrapbook-rose text-white text-xs font-medium rounded-full flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Popular
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-medium flex items-center gap-2">
                    Use Template <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
              <h3 className="font-display font-semibold text-gray-900">{template.name}</h3>
              <p className="text-sm text-gray-500">{template.pages} pages</p>
            </motion.div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No templates found matching your criteria</p>
          </div>
        )}
      </main>
    </div>
  )
}
