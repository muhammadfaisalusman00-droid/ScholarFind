import React, { useEffect, useState } from 'react';
import { AffiliatePromotion } from '../../types/scholarship';
import { promotionService, normalizeDestinationUrl } from '../../services/promotionService';

interface AffiliatePromotionCardProps {
  placement: 'Homepage' | 'Scholarship Details';
  className?: string;
}

export const AffiliatePromotionCard: React.FC<AffiliatePromotionCardProps> = ({ placement, className = '' }) => {
  const [promotions, setPromotions] = useState<AffiliatePromotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    promotionService.getActivePromotionsForPlacement(placement).then((activePromos) => {
      if (isMounted) {
        setPromotions(activePromos);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) {
        setPromotions([]);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [placement]);

  if (loading || promotions.length === 0) {
    return null;
  }

  // Display top promotion for this placement based on display_order
  const promo = promotions[0];

  const hasTitle = Boolean(promo.title && promo.title.trim());
  const hasDescription = Boolean(promo.description && promo.description.trim());
  const hasImage = Boolean(promo.imageUrl && promo.imageUrl.trim());
  const normalizedDestination = normalizeDestinationUrl(promo.destinationUrl);
  const hasDestination = Boolean(normalizedDestination);
  const isExternalWeb = normalizedDestination.startsWith('http://') || normalizedDestination.startsWith('https://');

  // If promotion has no content at all, don't render empty box
  if (!hasTitle && !hasDescription && !hasImage) {
    return null;
  }

  const WrapperTag = hasDestination ? 'a' : 'div';
  const wrapperProps = hasDestination
    ? {
        href: normalizedDestination,
        target: isExternalWeb ? '_blank' : undefined,
        rel: isExternalWeb ? 'noopener noreferrer' : undefined,
        className: 'group cursor-pointer block',
      }
    : { className: 'block' };

  return (
    <div className={`w-full ${className}`}>
      <WrapperTag {...(wrapperProps as any)}>
        <div className={`relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs transition-all ${hasDestination ? 'hover:shadow-md hover:border-indigo-300/80 hover:scale-[1.005]' : ''}`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
            {/* Image (if present) */}
            {hasImage && (
              <div className="w-full sm:w-36 md:w-44 h-32 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 flex items-center justify-center">
                <img
                  src={promo.imageUrl}
                  alt={promo.title || 'Promotional Offer'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Content Text (if title or description present) */}
            {(hasTitle || hasDescription) && (
              <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                {hasTitle && (
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
                    {promo.title}
                  </h4>
                )}

                {hasDescription && (
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed line-clamp-2">
                    {promo.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </WrapperTag>
    </div>
  );
};
