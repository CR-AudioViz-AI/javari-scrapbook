'use client';

// components/editor/CollaborationPanel.tsx
// Real-time collaboration features

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, X, Mail, UserPlus, Crown, Edit3, Eye, Trash2,
  Check, Copy, Share2, Link2, MessageSquare, Bell, Loader2
} from 'lucide-react';

interface Collaborator {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  status: 'active' | 'pending';
  invitedAt: string;
}

interface CollaborationPanelProps {
  scrapbookId: string;
  isOwner: boolean;
  onClose: () => void;
}

export function CollaborationPanel({ scrapbookId, isOwner, onClose }: CollaborationPanelProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('viewer');
  const [inviting, setInviting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    fetchCollaborators();
    setShareLink(`${window.location.origin}/view/${scrapbookId}`);
  }, [scrapbookId]);

  const fetchCollaborators = async () => {
    try {
      const response = await fetch(`/api/scrapbooks/${scrapbookId}/collaborate`);
      const data = await response.json();
      setCollaborators(data.collaborators || []);
    } catch (error) {
      console.error('Failed to fetch collaborators:', error);
    } finally {
      setLoading(false);
    }
  };

  const inviteCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviting(true);
    try {
      const response = await fetch(`/api/scrapbooks/${scrapbookId}/collaborate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      });

      if (response.ok) {
        setInviteEmail('');
        fetchCollaborators();
      }
    } catch (error) {
      console.error('Failed to invite:', error);
    } finally {
      setInviting(false);
    }
  };

  const removeCollaborator = async (collaboratorId: string) => {
    try {
      await fetch(`/api/scrapbooks/${scrapbookId}/collaborate?collaboratorId=${collaboratorId}`, {
        method: 'DELETE'
      });
      fetchCollaborators();
    } catch (error) {
      console.error('Failed to remove:', error);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return Crown;
      case 'editor': return Edit3;
      default: return Eye;
    }
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
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Collaborate</h2>
              <p className="text-sm text-gray-500">Invite others to view or edit</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Share Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Share Link</label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <Link2 className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 bg-transparent text-sm outline-none"
                />
              </div>
              <button
                onClick={copyShareLink}
                className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Invite Form */}
          {isOwner && (
            <form onSubmit={inviteCollaborator} className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Invite by Email</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                  className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm"
                >
                  <option value="viewer">Can View</option>
                  <option value="editor">Can Edit</option>
                </select>
                <button
                  type="submit"
                  disabled={inviting || !inviteEmail.trim()}
                  className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                </button>
              </div>
            </form>
          )}

          {/* Collaborators List */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              People with Access ({collaborators.length + 1})
            </label>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {/* Owner (You) */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                  Y
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">You</p>
                  <p className="text-sm text-gray-500">Owner</p>
                </div>
                <Crown className="w-5 h-5 text-yellow-500" />
              </div>

              {/* Other Collaborators */}
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : (
                collaborators.map((collab) => {
                  const RoleIcon = getRoleIcon(collab.role);
                  return (
                    <div key={collab.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                        {collab.email[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{collab.email}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {collab.status === 'pending' ? 'Invite pending' : collab.role}
                        </p>
                      </div>
                      <RoleIcon className={`w-5 h-5 ${collab.role === 'editor' ? 'text-blue-500' : 'text-gray-400'}`} />
                      {isOwner && (
                        <button
                          onClick={() => removeCollaborator(collab.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
