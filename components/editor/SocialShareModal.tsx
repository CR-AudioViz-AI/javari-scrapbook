// components/editor/SocialShareModal.tsx
// Social Share Modal for Scrapbook
// Timestamp: Friday, December 27, 2025 – 6:22 AM Eastern Time
// CR AudioViz AI - "Your Story. Our Design"

'use client';

import React, { useState } from 'react';
import {
  X,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Link,
  Mail,
  MessageCircle,
  Copy,
  Check,
  Download,
  Loader2,
  ExternalLink
} from 'lucide-react';

interface SocialShareModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  projectTitle?: string;
  projectImage?: string;
}

interface SharePlatform {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

const SHARE_PLATFORMS: SharePlatform[] = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-white', bgColor: 'bg-blue-600 hover:bg-blue-700' },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'text-white', bgColor: 'bg-black hover:bg-gray-800' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-white', bgColor: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500' },
  { id: 'email', name: 'Email', icon: Mail, color: 'text-white', bgColor: 'bg-gray-600 hover:bg-gray-700' },
  { id: 'message', name: 'Message', icon: MessageCircle, color: 'text-white', bgColor: 'bg-green-500 hover:bg-green-600' },
];

export default function SocialShareModal({ 
  isOpen = true, 
  onClose,
  projectTitle = 'My Scrapbook',
  projectImage
}: SocialShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const generateShareLink = () => {
    // In production, this would generate a real shareable link
    const link = `https://crav-scrapbook.vercel.app/share/${Date.now().toString(36)}`;
    setShareLink(link);
    return link;
  };

  const copyToClipboard = async () => {
    const link = shareLink || generateShareLink();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform: string) => {
    const link = shareLink || generateShareLink();
    const text = encodeURIComponent(`Check out my scrapbook: ${projectTitle}`);
    
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(link)}`,
      email: `mailto:?subject=${encodeURIComponent(projectTitle)}&body=${text}%0A%0A${encodeURIComponent(link)}`,
      message: `sms:?body=${text}%20${encodeURIComponent(link)}`,
    };

    if (platform === 'instagram') {
      // Instagram doesn't have a web share API - show instructions
      alert('To share on Instagram:
1. Download your scrapbook image
2. Open Instagram and create a new post
3. Upload your image');
      return;
    }

    const url = shareUrls[platform];
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const handleExportAndShare = async () => {
    setIsExporting(true);
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    generateShareLink();
    setIsExporting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Share2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Share Scrapbook</h2>
              <p className="text-sm text-gray-500">{projectTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview */}
        {projectImage && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img 
                src={projectImage} 
                alt={projectTitle}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Share Options */}
        <div className="p-4 space-y-4">
          {/* Social Buttons */}
          <div className="grid grid-cols-5 gap-2">
            {SHARE_PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleShare(platform.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl ${platform.bgColor} transition-all transform hover:scale-105`}
              >
                <platform.icon className={`w-5 h-5 ${platform.color}`} />
                <span className={`text-[10px] font-medium ${platform.color}`}>{platform.name}</span>
              </button>
            ))}
          </div>

          {/* Copy Link Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Share Link</label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Link className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={shareLink || 'Click to generate link...'}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-300 outline-none"
                  onClick={() => !shareLink && generateShareLink()}
                />
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Export & Share Button */}
          <button
            onClick={handleExportAndShare}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Preparing to share...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Export & Share High Quality</span>
              </>
            )}
          </button>

          {/* Tip */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Your scrapbook will be shared as a beautiful high-resolution image
          </p>
        </div>
      </div>
    </div>
  );
}
