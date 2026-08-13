import React, { useEffect, useRef, useState } from 'react';

export type AdPosition =
  | 'homepage-after-hero'
  | 'homepage-before-fields'
  | 'scholarship-directory'
  | 'scholarship-before-apply'
  | 'scholarship-related'
  | string;

export interface AdSlotProps {
  position: AdPosition;
  className?: string;
  adClient?: string;
  adSlot?: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  adHtml?: string;
}

/**
 * Dynamically loads the official Google AdSense script into <head>
 * only when a valid publisher ID is present.
 */
const loadAdSenseScript = (clientId: string) => {
  if (!clientId || typeof document === 'undefined') return;
  const scriptId = 'google-adsense-js';
  if (document.getElementById(scriptId)) return;

  const script = document.createElement('script');
  script.id = scriptId;
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
};

/**
 * Maps default environment variables to ad placement positions.
 */
const getEnvSlotForPosition = (position: string): string | undefined => {
  switch (position) {
    case 'homepage-after-hero':
      return import.meta.env.VITE_ADSENSE_SLOT_HOMEPAGE_AFTER_HERO;
    case 'homepage-before-fields':
      return import.meta.env.VITE_ADSENSE_SLOT_HOMEPAGE_BEFORE_FIELDS;
    case 'scholarship-directory':
      return import.meta.env.VITE_ADSENSE_SLOT_SCHOLARSHIP_DIRECTORY;
    case 'scholarship-before-apply':
      return import.meta.env.VITE_ADSENSE_SLOT_SCHOLARSHIP_BEFORE_APPLY;
    case 'scholarship-related':
      return import.meta.env.VITE_ADSENSE_SLOT_SCHOLARSHIP_RELATED;
    default:
      return undefined;
  }
};

/**
 * Reusable AdSlot Component for Google AdSense Architecture.
 *
 * Behavior:
 * - When no real advertisement client/slot is configured: Renders `null` (absolutely nothing in DOM).
 * - When a real advertisement is configured: Dynamically loads AdSense script and pushes ad unit.
 * - Protects against duplicate pushes caused by re-renders or StrictMode.
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  position,
  className = '',
  adClient: propAdClient,
  adSlot: propAdSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  adHtml,
}) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const insRef = useRef<HTMLModElement | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  const envAdClient = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined;
  const activeAdClient = propAdClient || envAdClient;
  const activeAdSlot = propAdSlot || getEnvSlotForPosition(position);

  // Determine if a real ad is configured and available
  const hasRealAd = Boolean(adHtml || (activeAdClient && activeAdSlot));

  useEffect(() => {
    if (!hasRealAd) {
      setAdLoaded(false);
      return;
    }

    if (activeAdClient && activeAdSlot) {
      // 1. Ensure the Google AdSense script is injected into <head>
      loadAdSenseScript(activeAdClient);

      // 2. Initialize ad unit safely with duplicate push protection
      if (
        insRef.current &&
        !isInitializedRef.current &&
        !insRef.current.getAttribute('data-adsbygoogle-status')
      ) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          isInitializedRef.current = true;
          setAdLoaded(true);
        } catch (e) {
          console.error('AdSense initialization error:', e);
        }
      }
    } else if (adHtml) {
      setAdLoaded(true);
    }
  }, [hasRealAd, activeAdClient, activeAdSlot, adHtml]);

  // If no real advertisement is configured or loaded, render NOTHING (null)
  if (!hasRealAd || (!adLoaded && !adHtml)) {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      data-ad-position={position}
      className={`w-full mx-auto text-center overflow-hidden transition-all ${className}`}
    >
      {adHtml ? (
        <div dangerouslySetInnerHTML={{ __html: adHtml }} />
      ) : (
        <ins
          ref={insRef}
          className="adsbygoogle block"
          style={{ display: 'block' }}
          data-ad-client={activeAdClient}
          data-ad-slot={activeAdSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
        />
      )}
    </aside>
  );
};
