import { useState, useCallback } from 'react';
import { copyToClipboard, isClipboardSupported } from '@/lib/clipboard';

interface UseClipboardOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const [copied, setCopied] = useState(false);
  const [isSupported] = useState(() => isClipboardSupported());

  const copy = useCallback(async (text: string) => {
    if (!isSupported) {
      const error = new Error('Copy to clipboard is not supported in this browser');
      options.onError?.(error);
      return false;
    }

    try {
      const success = await copyToClipboard(text);
      if (success) {
        setCopied(true);
        options.onSuccess?.();
        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
        return true;
      } else {
        const error = new Error('Failed to copy to clipboard');
        options.onError?.(error);
        return false;
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown clipboard error');
      options.onError?.(err);
      return false;
    }
  }, [isSupported, options]);

  return {
    copied,
    copy,
    isSupported,
  };
} 