import React from 'react';
import { Scholarship } from '../types/scholarship';

export interface ShareResult {
  shared: boolean;
  copied: boolean;
  error?: string;
}

/**
 * Returns the exact public URL for a given scholarship.
 * Uses the scholarship's unique slug or fallback id.
 */
export const getPublicScholarshipUrl = (scholarship: Scholarship): string => {
  const origin = window.location.origin;
  const slug = scholarship.slug || scholarship.id;
  return `${origin}/scholarships/${slug}`;
};

/**
 * Shares a scholarship using the native Web Share API where supported,
 * falling back to copying the link to the clipboard.
 */
export const shareScholarship = async (
  scholarship: Scholarship,
  e?: React.MouseEvent
): Promise<ShareResult> => {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }

  const url = getPublicScholarshipUrl(scholarship);
  const title = scholarship.title;
  const text = `Check out this scholarship on ScholarFind: ${scholarship.title}`;

  // 1. Try Native Web Share API if supported
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      return { shared: true, copied: false };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User closed or canceled the native share sheet
        return { shared: false, copied: false };
      }
      // Fallback to clipboard if native share encounters an error
    }
  }

  // 2. Clipboard API Fallback
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      return { shared: false, copied: true };
    } else {
      // Legacy document.execCommand fallback
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        return { shared: false, copied: true };
      }
    }
  } catch (err) {
    console.error('Clipboard copy failed:', err);
  }

  return { shared: false, copied: false, error: 'Could not copy link' };
};
