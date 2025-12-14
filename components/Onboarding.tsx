'use client';

// CRAV Scrapbook - Beautiful Onboarding & Quick Start Guide
// First-time user experience and helpful tips

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MousePointer2,
  Image,
  Type,
  Shapes,
  Layers,
  Download,
  ChevronRight,
  ChevronLeft,
  X,
  Keyboard,
  Lightbulb,
  Wand2,
  BookOpen,
  Palette,
  Layout,
  Grid3X3,
} from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to CRAV Scrapbook! ✨',
    description: 'Create beautiful digital scrapbooks with our powerful yet easy-to-use editor. Let\'s take a quick tour!',
    icon: BookOpen,
    color: 'from-pink-500 via-purple-500 to-indigo-500',
    tips: [
      'Preserve your precious memories digitally',
      'Drag and drop photos, stickers, and shapes',
      'Export to high-quality PDF for printing',
    ],
  },
  {
    id: 'canvas',
    title: 'Your Creative Canvas',
    description: 'The canvas is where the magic happens. Click to select elements, drag to move them, and use handles to resize.',
    icon: Layout,
    color: 'from-blue-500 to-cyan-500',
    tips: [
      'Click any element to select it',
      'Drag corners to resize',
      'Hold Shift for multi-select',
    ],
  },
  {
    id: 'tools',
    title: 'Powerful Tools at Your Fingertips',
    description: 'Add photos, text, shapes, and stickers from the toolbar. Each tool has intuitive controls.',
    icon: Palette,
    color: 'from-green-500 to-emerald-500',
    tips: [
      '📸 Photo - Add your memories',
      '✏️ Text - Add titles and captions',
      '◯ Shapes - Circles, hearts, stars',
    ],
  },
  {
    id: 'assets',
    title: 'Assets Library',
    description: 'Browse stickers, frames, backgrounds, and templates in the left panel. Click to add to your page!',
    icon: Grid3X3,
    color: 'from-orange-500 to-amber-500',
    tips: [
      'Upload your own photos',
      'Choose from 100+ stickers',
      'Apply beautiful backgrounds',
    ],
  },
  {
    id: 'properties',
    title: 'Fine-Tune Everything',
    description: 'Select an element and use the right panel to adjust colors, fonts, filters, shadows, and more.',
    icon: Wand2,
    color: 'from-purple-500 to-pink-500',
    tips: [
      'Adjust photo filters',
      'Change text fonts and colors',
      'Add shadows and borders',
    ],
  },
  {
    id: 'pages',
    title: 'Multi-Page Albums',
    description: 'Create beautiful multi-page albums using the pages panel. Add, duplicate, and organize pages easily.',
    icon: Layers,
    color: 'from-red-500 to-rose-500',
    tips: [
      'Click + to add new pages',
      'Choose from page templates',
      'Drag to reorder pages',
    ],
  },
];

const shortcuts = [
  { key: 'Ctrl + C', action: 'Copy' },
  { key: 'Ctrl + V', action: 'Paste' },
  { key: 'Ctrl + Z', action: 'Undo' },
  { key: 'Ctrl + D', action: 'Duplicate' },
  { key: 'Delete', action: 'Delete element' },
  { key: 'Ctrl + A', action: 'Select all' },
  { key: 'Arrow keys', action: 'Move element' },
  { key: 'Shift + Click', action: 'Multi-select' },
];

export function OnboardingOverlay({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-8"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl`}
              >
                <step.icon className="w-10 h-10 text-white" />
              </motion.div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-3">
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              {step.description}
            </p>

            {/* Tips */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-2xl p-5 space-y-3">
              {step.tips.map((tip, index) => (
                <motion.div
                  key={tip}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-6 bg-gradient-to-r from-pink-500 to-purple-500'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Get Started
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Quick tips popover that can appear contextually
export function QuickTip({ 
  title, 
  description, 
  position = 'bottom',
  onDismiss 
}: { 
  title: string; 
  description: string; 
  position?: 'top' | 'bottom' | 'left' | 'right';
  onDismiss: () => void;
}) {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`absolute ${positionClasses[position]} z-50 w-64`}
    >
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl p-4 shadow-2xl">
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">{title}</h4>
            <p className="text-sm text-purple-100">{description}</p>
          </div>
        </div>
      </div>
      {/* Arrow */}
      <div className={`absolute w-3 h-3 bg-purple-600 rotate-45 ${
        position === 'bottom' ? '-top-1.5 left-1/2 -translate-x-1/2' :
        position === 'top' ? '-bottom-1.5 left-1/2 -translate-x-1/2' :
        position === 'right' ? '-left-1.5 top-1/2 -translate-y-1/2' :
        '-right-1.5 top-1/2 -translate-y-1/2'
      }`} />
    </motion.div>
  );
}

// Keyboard shortcuts modal
export function KeyboardShortcutsModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Keyboard className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-3">
          {shortcuts.map((shortcut, index) => (
            <motion.div
              key={shortcut.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.02 * index }}
              className="flex items-center justify-between"
            >
              <span className="text-gray-600 dark:text-gray-400">{shortcut.action}</span>
              <kbd className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-mono font-medium text-gray-800 dark:text-gray-200">
                {shortcut.key}
              </kbd>
            </motion.div>
          ))}
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">?</kbd> anytime to see shortcuts
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Empty canvas state with helpful prompts
export function EmptyCanvasPrompt({ onAddPhoto, onAddText, onBrowseTemplates }: { 
  onAddPhoto: () => void; 
  onAddText: () => void;
  onBrowseTemplates: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div className="text-center max-w-md pointer-events-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-indigo-400/20 flex items-center justify-center"
        >
          <Sparkles className="w-12 h-12 text-purple-500" />
        </motion.div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Let&apos;s Create Something Beautiful!
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Start by adding a photo, some text, or choose a template to get inspired.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onAddPhoto}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Image className="w-5 h-5" />
            Add Photo
          </button>
          <button
            onClick={onAddText}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Type className="w-5 h-5" />
            Add Text
          </button>
          <button
            onClick={onBrowseTemplates}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Layout className="w-5 h-5" />
            Templates
          </button>
        </div>
      </div>
    </motion.div>
  );
}
