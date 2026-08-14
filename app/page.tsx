'use client';

// app/page.tsx
// Beautiful landing page for javari Scrapbook

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen, Sparkles, Image, Palette, Share2, Cloud, Zap,
  Users, Crown, ArrowRight, Check, Play, Star, ChevronRight,
  Download, Wand2, Layout, Layers, Gift, Heart
} from 'lucide-react';

const FEATURES = [
  { icon: Wand2, title: 'AI-Powered Tools', description: 'Remove backgrounds, enhance photos, and generate designs with AI' },
  { icon: Image, title: 'Millions of Free Photos', description: 'Access Unsplash, Pexels, Pixabay, and Giphy stickers' },
  { icon: Layout, title: '50+ Templates', description: 'Professional designs for weddings, babies, travel, and more' },
  { icon: Palette, title: 'Curated Palettes', description: '40+ beautiful color schemes for any occasion' },
  { icon: Users, title: 'Real-time Collaboration', description: 'Invite friends and family to edit together' },
  { icon: Download, title: 'Export Anywhere', description: 'PDF, PNG, or print-ready files for any service' },
];

const TEMPLATES = [
  { name: "Baby's First Year", category: 'Baby', color: '#f9a8d4' },
  { name: 'Wedding Album', category: 'Wedding', color: '#fbbf24' },
  { name: 'Travel Adventure', category: 'Travel', color: '#60a5fa' },
  { name: 'Family Heritage', category: 'Family', color: '#34d399' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                javari Scrapbook
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-pink-500 transition">Features</a>
              <a href="#templates" className="text-gray-600 dark:text-gray-300 hover:text-pink-500 transition">Templates</a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-pink-500 transition">Pricing</a>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-pink-500 transition">
                Sign In
              </Link>
              <Link
                href="/editor/new"
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 dark:bg-pink-900/30 rounded-full text-pink-600 dark:text-pink-400 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Digital Scrapbooking
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Your Story.
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Our Design.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10"
            >
              Create beautiful digital scrapbooks with AI-powered tools, millions of free photos,
              50+ professional templates, and seamless collaboration.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/editor/new"
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition shadow-lg shadow-pink-500/25"
              >
                Start Creating Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#demo"
                className="flex items-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-sm text-gray-500"
            >
              No credit card required • Free forever for basic features
            </motion.p>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-10 h-32 bottom-0 top-auto" />
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-3xl p-8 shadow-2xl">
              <div className="aspect-video bg-white dark:bg-gray-800 rounded-2xl shadow-inner flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="w-24 h-24 text-pink-300 mx-auto mb-4" />
                  <p className="text-gray-400">Editor Preview</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Create
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Powerful tools, beautiful templates, and AI magic at your fingertips
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              50+ Professional Templates
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Start with a beautiful design, customize to make it yours
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMPLATES.map((template, index) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div 
                  className="aspect-[3/4] rounded-2xl mb-4 overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300"
                  style={{ background: `linear-gradient(135deg, ${template.color}40, ${template.color})` }}
                >
                  <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <BookOpen className="w-16 h-16 text-white/50" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">{template.name}</h3>
                <p className="text-sm text-gray-500">{template.category}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 text-pink-500 font-medium hover:gap-3 transition-all"
            >
              View All Templates <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Creating?</h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of creators making beautiful scrapbooks every day
            </p>
            <Link
              href="/editor/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg hover:bg-gray-100 transition"
            >
              Create Your First Scrapbook <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">javari Scrapbook</span>
            </div>
            
            <div className="flex items-center gap-8">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>

            <p className="text-sm">© 2025 CR AudioViz AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
