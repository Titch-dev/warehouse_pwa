'use client';

import { useCallback } from 'react';
import { useToast } from './toast-provider';

function buildShareUrl(event) {
  if (!event?.slug) return null;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/events/share?slug=${encodeURIComponent(event.slug)}`;
}

export default function ShareButton({
  event,
  className = '',
  children,
  onShared,
  copiedToast = true,
}) {
  const { showToast } = useToast();

  const handleShare = useCallback(
    async (e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();

      if (!event?.slug) return;

      const url = buildShareUrl(event);
      if (!url) return;

      const title = event?.name || 'Event';
      const text = event?.description
        ? event.description.slice(0, 120)
        : `Check out this event: ${title}`;

      try {
        if (navigator.share) {
          await navigator.share({ title, text, url });
          onShared?.({ method: 'native', url });
          return;
        }

        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);

          if (copiedToast) showToast('Link copied to clipboard');
          onShared?.({ method: 'clipboard', url });
          return;
        }

        window.prompt('Copy this link:', url);
        onShared?.({ method: 'prompt', url });
      } catch (err) {
        if (err?.name !== 'AbortError') console.error('Share failed:', err);
      }
    },
    [event, onShared, showToast, copiedToast]
  );

  if (!event?.slug) return null;

  return (
    <button type="button" className={className} onClick={handleShare}>
      {children ?? 'Share'}
    </button>
  );
}