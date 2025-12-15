'use client';

// components/editor/ExportModal.tsx
// Export scrapbook to PDF, PNG, or Print-Ready formats

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X, FileText, Image, Printer, Share2, Download, Loader2,
  Check, ChevronRight, ExternalLink, QrCode, Copy, Mail,
  Facebook, Twitter
} from 'lucide-react';

interface ExportModalProps {
  scrapbookId: string;
  scrapbookTitle: string;
  pageCount: number;
  onClose: () => void;
}

type ExportFormat = 'pdf' | 'png' | 'print' | 'share';

const EXPORT_OPTIONS = [
  {
    id: 'pdf' as ExportFormat,
    name: 'PDF Document',
    icon: FileText,
    description: 'High-quality PDF for viewing and sharing',
    features: ['All pages in one file', 'Preserves quality', 'Easy to share']
  },
  {
    id: 'png' as ExportFormat,
    name: 'PNG Images',
    icon: Image,
    description: 'Individual high-resolution images',
    features: ['300 DPI quality', 'Transparent backgrounds', 'Per-page export']
  },
  {
    id: 'print' as ExportFormat,
    name: 'Print Ready',
    icon: Printer,
    description: 'Professional print-ready files',
    features: ['Bleed margins', 'Crop marks', 'CMYK ready']
  },
  {
    id: 'share' as ExportFormat,
    name: 'Share Online',
    icon: Share2,
    description: 'Get a shareable link or embed code',
    features: ['Public link', 'Social sharing', 'Embed on website']
  }
];

const PRINT_SERVICES = [
  { name: 'Shutterfly', url: 'https://shutterfly.com', logo: '📷' },
  { name: 'Snapfish', url: 'https://snapfish.com', logo: '🐟' },
  { name: 'Mixbook', url: 'https://mixbook.com', logo: '📚' },
  { name: 'Artifact Uprising', url: 'https://artifactuprising.com', logo: '✨' }
];

export function ExportModal({ scrapbookId, scrapbookTitle, pageCount, onClose }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportResult, setExportResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // PDF Options
  const [pdfQuality, setPdfQuality] = useState<'standard' | 'high' | 'maximum'>('high');
  
  // PNG Options
  const [pngScale, setPngScale] = useState(2);
  const [pngPages, setPngPages] = useState<'all' | 'current'>('all');

  // Print Options
  const [paperSize, setPaperSize] = useState('8x10');
  const [includeBleed, setIncludeBleed] = useState(true);
  const [includeCropMarks, setIncludeCropMarks] = useState(true);

  const handleExport = async () => {
    if (!selectedFormat) return;
    
    setExporting(true);
    setExportProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scrapbookId,
          format: selectedFormat,
          options: {
            quality: pdfQuality,
            scale: pngScale,
            pages: pngPages,
            paperSize,
            bleed: includeBleed,
            cropMarks: includeCropMarks
          }
        })
      });

      clearInterval(progressInterval);
      setExportProgress(100);

      const data = await response.json();
      setExportResult(data);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Export Scrapbook</h2>
            <p className="text-sm text-gray-500">{scrapbookTitle} • {pageCount} pages</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!selectedFormat ? (
            /* Format Selection */
            <div className="grid grid-cols-2 gap-4">
              {EXPORT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedFormat(option.id)}
                  className="flex flex-col items-start p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <option.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{option.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{option.description}</p>
                  <ul className="space-y-1">
                    {option.features.map((feature, i) => (
                      <li key={i} className="text-xs text-gray-400 flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          ) : exportResult ? (
            /* Export Result */
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Export Ready!</h3>
              
              {selectedFormat === 'share' && exportResult.config && (
                <div className="mt-6 space-y-4 max-w-md mx-auto">
                  {/* Share URL */}
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">Share Link</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={exportResult.config.shareUrl}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(exportResult.config.shareUrl)}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center gap-2"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Social Sharing */}
                  <div className="flex justify-center gap-4">
                    <a
                      href={exportResult.config.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center hover:opacity-90 transition"
                    >
                      <Facebook className="w-6 h-6 text-white" />
                    </a>
                    <a
                      href={exportResult.config.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center hover:opacity-90 transition"
                    >
                      <Twitter className="w-6 h-6 text-white" />
                    </a>
                    <a
                      href={exportResult.config.socialLinks.email}
                      className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center hover:opacity-90 transition"
                    >
                      <Mail className="w-6 h-6 text-white" />
                    </a>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 inline-block">
                    <img src={exportResult.config.qrCode} alt="QR Code" className="w-32 h-32" />
                  </div>
                </div>
              )}

              {selectedFormat === 'print' && (
                <div className="mt-6">
                  <p className="text-gray-500 mb-4">Order prints from our partners:</p>
                  <div className="flex justify-center gap-4">
                    {PRINT_SERVICES.map((service) => (
                      <a
                        key={service.name}
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                      >
                        <span className="text-2xl">{service.logo}</span>
                        <span className="text-sm font-medium">{service.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {(selectedFormat === 'pdf' || selectedFormat === 'png') && (
                <button className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 flex items-center gap-2 mx-auto">
                  <Download className="w-5 h-5" />
                  Download {selectedFormat.toUpperCase()}
                </button>
              )}
            </div>
          ) : (
            /* Export Options */
            <div className="space-y-6">
              <button
                onClick={() => setSelectedFormat(null)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ← Back to formats
              </button>

              {selectedFormat === 'pdf' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">PDF Quality</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {(['standard', 'high', 'maximum'] as const).map((quality) => (
                      <button
                        key={quality}
                        onClick={() => setPdfQuality(quality)}
                        className={`p-4 rounded-xl border-2 transition ${
                          pdfQuality === quality
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <p className="font-medium capitalize">{quality}</p>
                        <p className="text-sm text-gray-500">
                          {quality === 'standard' && '72 DPI'}
                          {quality === 'high' && '150 DPI'}
                          {quality === 'maximum' && '300 DPI'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedFormat === 'png' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Image Scale</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((scale) => (
                      <button
                        key={scale}
                        onClick={() => setPngScale(scale)}
                        className={`p-4 rounded-xl border-2 transition ${
                          pngScale === scale
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <p className="font-medium">{scale}x</p>
                        <p className="text-sm text-gray-500">{scale * 100}%</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedFormat === 'print' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Print Settings</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <input
                        type="checkbox"
                        checked={includeBleed}
                        onChange={(e) => setIncludeBleed(e.target.checked)}
                        className="w-5 h-5 rounded"
                      />
                      <div>
                        <p className="font-medium">Include Bleed</p>
                        <p className="text-sm text-gray-500">0.125" bleed margin for professional printing</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <input
                        type="checkbox"
                        checked={includeCropMarks}
                        onChange={(e) => setIncludeCropMarks(e.target.checked)}
                        className="w-5 h-5 rounded"
                      />
                      <div>
                        <p className="font-medium">Crop Marks</p>
                        <p className="text-sm text-gray-500">Add trim marks for professional cutting</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={exporting}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {exporting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Exporting... {exportProgress}%
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Export {selectedFormat.toUpperCase()}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
