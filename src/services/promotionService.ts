import { AffiliatePromotion, PromotionPlacement, PromotionStatus } from '../types/scholarship';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const PROMOTIONS_STORAGE_KEY = 'sf_promotions_db';

export const normalizeDestinationUrl = (url?: string | null): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // If already starts with a protocol scheme (e.g., http://, https://, mailto:, tel:, ftp://)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

const getLocalPromotions = (): AffiliatePromotion[] => {
  try {
    const raw = localStorage.getItem(PROMOTIONS_STORAGE_KEY);
    if (!raw) {
      return []; // MUST BE EMPTY BY DEFAULT (NO DEMO DATA)
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const saveLocalPromotions = (data: AffiliatePromotion[]): void => {
  localStorage.setItem(PROMOTIONS_STORAGE_KEY, JSON.stringify(data));
};

const mapDbToPromotion = (row: any): AffiliatePromotion => ({
  id: row.id,
  title: row.title || undefined,
  description: row.description || undefined,
  imageUrl: row.image_url || undefined,
  destinationUrl: row.destination_url || undefined,
  placement: (row.placement as PromotionPlacement) || 'Homepage',
  status: (row.status as PromotionStatus) || 'Active',
  displayOrder: row.display_order ?? 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const promotionService = {
  async getPromotions(): Promise<AffiliatePromotion[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('affiliate_promotions')
          .select('*')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map(mapDbToPromotion);
        }
      } catch (err) {
        console.warn('Failed to fetch promotions from Supabase, falling back to local storage:', err);
      }
    }
    return getLocalPromotions();
  },

  async getActivePromotionsForPlacement(placement: 'Homepage' | 'Scholarship Details'): Promise<AffiliatePromotion[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('affiliate_promotions')
          .select('*')
          .eq('status', 'Active')
          .in('placement', [placement, 'Both'])
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map(mapDbToPromotion);
        }
      } catch (err) {
        console.warn('Failed to fetch active promotions from Supabase, falling back to local storage:', err);
      }
    }

    const local = getLocalPromotions();
    return local
      .filter((p) => p.status === 'Active' && (p.placement === placement || p.placement === 'Both'))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async getPromotionById(id: string): Promise<AffiliatePromotion | null> {
    const all = await this.getPromotions();
    return all.find((p) => p.id === id) || null;
  },

  async uploadPromotionImage(file: File): Promise<string> {
    if (isSupabaseConfigured() && supabase) {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `promo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const { error } = await supabase.storage
        .from('scholarship-covers')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        throw new Error(`Promotion image upload failed: ${error.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from('scholarship-covers')
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  },

  async savePromotion(
    promo: {
      id?: string;
      title?: string;
      description?: string;
      imageUrl?: string;
      destinationUrl?: string;
      placement: PromotionPlacement;
      status?: PromotionStatus;
      displayOrder?: number;
    },
    imageFile?: File | null
  ): Promise<AffiliatePromotion> {
    let finalImageUrl = promo.imageUrl;

    if (imageFile) {
      finalImageUrl = await this.uploadPromotionImage(imageFile);
    }

    const id = promo.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `promo-${Date.now()}`);
    const targetPlacement = promo.placement || 'Homepage';
    const normalizedDestination = normalizeDestinationUrl(promo.destinationUrl);

    if (isSupabaseConfigured() && supabase) {
      // Slot replacement logic:
      // - Homepage target: replaces any existing Homepage or Both promotion while preserving Scholarship Details
      // - Scholarship Details target: replaces any existing Scholarship Details or Both promotion while preserving Homepage
      // - Both target: replaces both Homepage and Scholarship Details promotions
      if (targetPlacement === 'Homepage') {
        await supabase.from('affiliate_promotions').delete().in('placement', ['Homepage', 'Both']).neq('id', id);
      } else if (targetPlacement === 'Scholarship Details') {
        await supabase.from('affiliate_promotions').delete().in('placement', ['Scholarship Details', 'Both']).neq('id', id);
      } else if (targetPlacement === 'Both') {
        await supabase.from('affiliate_promotions').delete().neq('id', id);
      }

      const dbRecord = {
        id,
        title: promo.title ? promo.title.trim() : null,
        description: promo.description ? promo.description.trim() : null,
        image_url: finalImageUrl ? finalImageUrl.trim() : null,
        destination_url: normalizedDestination ? normalizedDestination : null,
        placement: targetPlacement,
        status: 'Active',
        display_order: Number(promo.displayOrder) || 0,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('affiliate_promotions').upsert(dbRecord);
      if (error) {
        throw new Error(`Failed to save promotion in Supabase: ${error.message}`);
      }
    }

    // Local storage fallback synchronization
    let local = getLocalPromotions();
    if (targetPlacement === 'Homepage') {
      local = local.filter((p) => p.id === id || (p.placement !== 'Homepage' && p.placement !== 'Both'));
    } else if (targetPlacement === 'Scholarship Details') {
      local = local.filter((p) => p.id === id || (p.placement !== 'Scholarship Details' && p.placement !== 'Both'));
    } else if (targetPlacement === 'Both') {
      local = local.filter((p) => p.id === id);
    }

    const savedPromo: AffiliatePromotion = {
      id,
      title: promo.title ? promo.title.trim() : undefined,
      description: promo.description ? promo.description.trim() : undefined,
      imageUrl: finalImageUrl ? finalImageUrl.trim() : undefined,
      destinationUrl: normalizedDestination ? normalizedDestination : undefined,
      placement: targetPlacement,
      status: 'Active',
      displayOrder: Number(promo.displayOrder) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existingIdx = local.findIndex((p) => p.id === id);
    if (existingIdx !== -1) {
      local[existingIdx] = savedPromo;
    } else {
      local.push(savedPromo);
    }
    saveLocalPromotions(local);

    return savedPromo;
  },

  async deletePromotion(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('affiliate_promotions').delete().eq('id', id);
      if (error) {
        throw new Error(`Failed to delete promotion from Supabase: ${error.message}`);
      }
    }

    const local = getLocalPromotions();
    const filtered = local.filter((p) => p.id !== id);
    saveLocalPromotions(filtered);
    return true;
  },

  async togglePromotionStatus(id: string): Promise<AffiliatePromotion | null> {
    const all = await this.getPromotions();
    const target = all.find((p) => p.id === id);
    if (!target) return null;

    const newStatus: PromotionStatus = target.status === 'Active' ? 'Inactive' : 'Active';

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('affiliate_promotions')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to toggle status: ${error.message}`);
      }
    }

    target.status = newStatus;
    const local = getLocalPromotions();
    const idx = local.findIndex((p) => p.id === id);
    if (idx !== -1) {
      local[idx].status = newStatus;
      saveLocalPromotions(local);
    }

    return target;
  },
};
