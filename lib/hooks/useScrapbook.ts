// lib/hooks/useScrapbook.ts
// Custom hooks for scrapbook data management

import { useState, useEffect, useCallback } from 'react';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Hook for fetching single scrapbook
export function useScrapbook(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/scrapbooks/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000
    }
  );

  const updateScrapbook = useCallback(async (updates: any) => {
    if (!id) return;
    
    // Optimistic update
    mutate({ ...data, ...updates }, false);
    
    try {
      const response = await fetch(`/api/scrapbooks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      const result = await response.json();
      mutate(result.scrapbook);
      return result;
    } catch (error) {
      mutate(); // Revert on error
      throw error;
    }
  }, [id, data, mutate]);

  return {
    scrapbook: data,
    isLoading,
    error,
    updateScrapbook,
    refresh: mutate
  };
}

// Hook for fetching user's scrapbooks
export function useScrapbooks(options?: {
  filter?: string;
  sort?: string;
  order?: string;
}) {
  const params = new URLSearchParams();
  if (options?.filter) params.set('filter', options.filter);
  if (options?.sort) params.set('sort', options.sort);
  if (options?.order) params.set('order', options.order);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/scrapbooks?${params}`,
    fetcher
  );

  const createScrapbook = useCallback(async (scrapbookData: any) => {
    const response = await fetch('/api/scrapbooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scrapbookData)
    });
    
    const result = await response.json();
    mutate();
    return result;
  }, [mutate]);

  const deleteScrapbook = useCallback(async (id: string) => {
    await fetch(`/api/scrapbooks/${id}`, { method: 'DELETE' });
    mutate();
  }, [mutate]);

  return {
    scrapbooks: data?.scrapbooks || [],
    total: data?.total || 0,
    isLoading,
    error,
    createScrapbook,
    deleteScrapbook,
    refresh: mutate
  };
}

// Hook for stock photos
export function useStockPhotos(query: string, options?: {
  source?: string;
  orientation?: string;
  page?: number;
}) {
  const params = new URLSearchParams({ query });
  if (options?.source) params.set('source', options.source);
  if (options?.orientation) params.set('orientation', options.orientation);
  if (options?.page) params.set('page', options.page.toString());

  const { data, error, isLoading } = useSWR(
    query ? `/api/stock/photos?${params}` : null,
    fetcher
  );

  return {
    photos: data?.photos || [],
    isLoading,
    error
  };
}

// Hook for templates
export function useTemplates(category?: string) {
  const { data, error, isLoading } = useSWR(
    `/api/templates${category ? `?category=${category}` : ''}`,
    fetcher
  );

  return {
    templates: data?.templates || [],
    categories: data?.categories || [],
    isLoading,
    error
  };
}

// Hook for user uploads
export function useUploads() {
  const { data, error, isLoading, mutate } = useSWR('/api/upload', fetcher);

  const uploadFile = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    mutate();
    return result;
  }, [mutate]);

  const deleteUpload = useCallback(async (id: string) => {
    await fetch(`/api/upload?id=${id}`, { method: 'DELETE' });
    mutate();
  }, [mutate]);

  return {
    uploads: data?.uploads || [],
    isLoading,
    error,
    uploadFile,
    deleteUpload,
    refresh: mutate
  };
}

// Hook for autosave
export function useAutosave(
  scrapbookId: string,
  data: any,
  options?: { interval?: number; enabled?: boolean }
) {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { interval = 30000, enabled = true } = options || {};

  const save = useCallback(async () => {
    if (!scrapbookId || !enabled) return;
    
    setSaving(true);
    try {
      await fetch(`/api/scrapbooks/${scrapbookId}/autosave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Autosave failed:', error);
    } finally {
      setSaving(false);
    }
  }, [scrapbookId, data, enabled]);

  useEffect(() => {
    if (!enabled) return;
    
    const timer = setInterval(save, interval);
    return () => clearInterval(timer);
  }, [save, interval, enabled]);

  return { saving, lastSaved, saveNow: save };
}

// Hook for collaboration
export function useCollaboration(scrapbookId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    scrapbookId ? `/api/scrapbooks/${scrapbookId}/collaborate` : null,
    fetcher
  );

  const inviteCollaborator = useCallback(async (email: string, role: 'viewer' | 'editor') => {
    const response = await fetch(`/api/scrapbooks/${scrapbookId}/collaborate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role })
    });
    
    const result = await response.json();
    mutate();
    return result;
  }, [scrapbookId, mutate]);

  const removeCollaborator = useCallback(async (collaboratorId: string) => {
    await fetch(`/api/scrapbooks/${scrapbookId}/collaborate?collaboratorId=${collaboratorId}`, {
      method: 'DELETE'
    });
    mutate();
  }, [scrapbookId, mutate]);

  return {
    collaborators: data?.collaborators || [],
    isLoading,
    error,
    inviteCollaborator,
    removeCollaborator,
    refresh: mutate
  };
}

// Hook for comments
export function useComments(scrapbookId: string, pageId?: string) {
  const params = pageId ? `?pageId=${pageId}` : '';
  const { data, error, isLoading, mutate } = useSWR(
    scrapbookId ? `/api/scrapbooks/${scrapbookId}/comments${params}` : null,
    fetcher
  );

  const addComment = useCallback(async (content: string, position?: { x: number; y: number }) => {
    const response = await fetch(`/api/scrapbooks/${scrapbookId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId, content, position })
    });
    
    const result = await response.json();
    mutate();
    return result;
  }, [scrapbookId, pageId, mutate]);

  const resolveComment = useCallback(async (commentId: string) => {
    await fetch(`/api/scrapbooks/${scrapbookId}/comments`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId, resolved: true })
    });
    mutate();
  }, [scrapbookId, mutate]);

  return {
    comments: data?.comments || [],
    isLoading,
    error,
    addComment,
    resolveComment,
    refresh: mutate
  };
}
