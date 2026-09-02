import { Scholarship, FieldItem, SiteSettings } from '../types/scholarship';
import { MOCK_SCHOLARSHIPS } from '../data/scholarships';
import { ALL_FIELDS, HomepageFieldsData } from '../data/fieldsData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const SCHOLARSHIPS_STORAGE_KEY = 'sf_scholarships_db';
const FIELDS_STORAGE_KEY = 'sf_fields_db';
const SETTINGS_STORAGE_KEY = 'sf_settings_db';

// Helper to initialize local storage dataset if empty
const getLocalScholarships = (): Scholarship[] => {
  try {
    const raw = localStorage.getItem(SCHOLARSHIPS_STORAGE_KEY);
    if (!raw) {
      const initial = MOCK_SCHOLARSHIPS.map((item) => ({
        ...item,
        status: item.status || 'Published',
        createdAt: item.dateAdded || new Date().toISOString().split('T')[0],
        updatedAt: item.dateAdded || new Date().toISOString().split('T')[0],
      }));
      localStorage.setItem(SCHOLARSHIPS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_SCHOLARSHIPS.map(item => ({ ...item, status: 'Published' }));
  }
};

const saveLocalScholarships = (data: Scholarship[]): void => {
  localStorage.setItem(SCHOLARSHIPS_STORAGE_KEY, JSON.stringify(data));
};

const getLocalFields = (): FieldItem[] => {
  try {
    const raw = localStorage.getItem(FIELDS_STORAGE_KEY);
    if (!raw) {
      const initial: FieldItem[] = HomepageFieldsData.HOMEPAGE_FIELDS.map((f) => ({
        id: f.id,
        name: f.field,
        description: f.description,
        status: 'Active',
      }));
      localStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return HomepageFieldsData.HOMEPAGE_FIELDS.map((f) => ({
      id: f.id,
      name: f.field,
      description: f.description,
      status: 'Active',
    }));
  }
};

const saveLocalFields = (fields: FieldItem[]): void => {
  localStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(fields));
};

const getLocalSettings = (): SiteSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      const defaultSettings: SiteSettings = {
        siteName: 'ScholarFind',
        contactEmail: 'scholarfindstudents@gmail.com',
        maintenanceMode: false,
      };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    return JSON.parse(raw);
  } catch {
    return {
      siteName: 'ScholarFind',
      contactEmail: 'scholarfindstudents@gmail.com',
      maintenanceMode: false,
    };
  }
};

// Helpers to translate between DB snake_case and TypeScript camelCase
const mapDbToScholarship = (row: any): Scholarship => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  organization: row.organization,
  country: row.country,
  studyDestination: row.study_destination || row.country,
  degreeLevel: row.degree_level,
  fieldOfStudy: row.field_of_study,
  fundingType: row.funding_type,
  amount: row.amount || '',
  deadline: row.deadline,
  eligibleCountries: row.eligible_countries,
  description: row.description,
  benefits: Array.isArray(row.benefits) ? row.benefits : [],
  eligibility: Array.isArray(row.eligibility) ? row.eligibility : [],
  requirements: Array.isArray(row.requirements) ? row.requirements : [],
  applicationInstructions: Array.isArray(row.application_instructions) ? row.application_instructions : [],
  applicationUrl: row.application_url,
  sourceUrl: row.source_url || '',
  dateAdded: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '',
  lastVerified: row.updated_at ? new Date(row.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '',
  featured: row.featured || false,
  imageUrl: row.image_url || '',
  status: row.status || 'Published',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapScholarshipToDb = (s: Partial<Scholarship>) => {
  const dbObj: Record<string, any> = {};
  if (s.title !== undefined) dbObj.title = s.title;
  if (s.slug !== undefined) dbObj.slug = s.slug;
  if (s.organization !== undefined) dbObj.organization = s.organization;
  if (s.country !== undefined) dbObj.country = s.country;
  if (s.studyDestination !== undefined) dbObj.study_destination = s.studyDestination;
  if (s.degreeLevel !== undefined) dbObj.degree_level = s.degreeLevel;
  if (s.fieldOfStudy !== undefined) dbObj.field_of_study = s.fieldOfStudy;
  if (s.fundingType !== undefined) dbObj.funding_type = s.fundingType;
  if (s.amount !== undefined) dbObj.amount = s.amount;
  if (s.deadline !== undefined) dbObj.deadline = s.deadline;
  if (s.eligibleCountries !== undefined) dbObj.eligible_countries = s.eligibleCountries;
  if (s.description !== undefined) dbObj.description = s.description;
  if (s.benefits !== undefined) dbObj.benefits = s.benefits;
  if (s.eligibility !== undefined) dbObj.eligibility = s.eligibility;
  if (s.requirements !== undefined) dbObj.requirements = s.requirements;
  if (s.applicationInstructions !== undefined) dbObj.application_instructions = s.applicationInstructions;
  if (s.applicationUrl !== undefined) dbObj.application_url = s.applicationUrl;
  if (s.sourceUrl !== undefined) dbObj.source_url = s.sourceUrl;
  if (s.imageUrl !== undefined) dbObj.image_url = s.imageUrl;
  if (s.status !== undefined) dbObj.status = s.status;
  if (s.featured !== undefined) dbObj.featured = s.featured;
  return dbObj;
};

export const generateBaseSlug = (title: string): string => {
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  if (!slug) slug = `scholarship-${Date.now()}`;
  return slug;
};

export const isSlugTaken = async (slug: string, excludeId?: string): Promise<boolean> => {
  if (isSupabaseConfigured() && supabase) {
    let query = supabase
      .from('scholarships')
      .select('id')
      .eq('slug', slug);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query.limit(1);
    if (!error && data && data.length > 0) {
      return true;
    }
  }

  const local = getLocalScholarships();
  return local.some((s) => s.slug === slug && s.id !== excludeId);
};

export const generateUniqueSlug = async (title: string, excludeId?: string): Promise<string> => {
  const baseSlug = generateBaseSlug(title);
  let candidateSlug = baseSlug;
  let counter = 1;

  while (await isSlugTaken(candidateSlug, excludeId)) {
    counter++;
    candidateSlug = `${baseSlug}-${counter}`;
  }

  return candidateSlug;
};

export const scholarshipService = {
  // Public methods: Returns ONLY Published scholarships
  async getPublicScholarships(): Promise<Scholarship[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .eq('status', 'Published')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(mapDbToScholarship);
      }
    }

    const local = getLocalScholarships();
    return local.filter((s) => (s.status || 'Published') === 'Published');
  },

  async getPublicScholarshipBySlug(slug: string): Promise<Scholarship | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'Published')
        .maybeSingle();

      if (!error && data) {
        return mapDbToScholarship(data);
      }
    }

    const local = getLocalScholarships();
    return local.find((s) => s.slug === slug && (s.status || 'Published') === 'Published') || null;
  },

  // Admin methods: Access ALL scholarships (Published, Draft, Archived)
  async getAdminScholarships(): Promise<Scholarship[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(mapDbToScholarship);
      }
    }

    return getLocalScholarships();
  },

  async getAdminScholarshipById(id: string): Promise<Scholarship | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return mapDbToScholarship(data);
      }
    }

    const local = getLocalScholarships();
    return local.find((s) => s.id === id) || null;
  },

  async createScholarship(data: Omit<Scholarship, 'id' | 'slug' | 'dateAdded' | 'lastVerified'>): Promise<Scholarship> {
    const today = new Date().toISOString().split('T')[0];
    let attempts = 0;
    const maxAttempts = 10;

    // Generate initial unique slug based on data.title
    let slug = await generateUniqueSlug(data.title);

    while (attempts < maxAttempts) {
      attempts++;
      const newScholarship: Scholarship = {
        ...data,
        id: `sf-${Date.now()}`,
        slug,
        dateAdded: today,
        lastVerified: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        status: data.status || 'Published',
        createdAt: today,
        updatedAt: today,
      };

      if (isSupabaseConfigured() && supabase) {
        const dbPayload = mapScholarshipToDb(newScholarship);
        delete dbPayload.id; // Let PostgreSQL generate UUID if creating new
        dbPayload.slug = slug;

        const { data: created, error } = await supabase
          .from('scholarships')
          .insert([dbPayload])
          .select()
          .single();

        if (error) {
          const isDuplicateKey = error.code === '23505' ||
            error.message.includes('unique constraint') ||
            error.message.includes('duplicate key') ||
            error.message.includes('scholarships_slug_key');

          if (isDuplicateKey && attempts < maxAttempts) {
            slug = await generateUniqueSlug(`${data.title}-${attempts + 1}`);
            continue;
          }
          console.warn('Supabase insert failed, storing locally:', error.message);
        } else if (created) {
          return mapDbToScholarship(created);
        }
      }

      const local = getLocalScholarships();
      local.unshift(newScholarship);
      saveLocalScholarships(local);
      return newScholarship;
    }

    throw new Error('Failed to create scholarship due to recurring slug conflicts.');
  },

  async updateScholarship(id: string, updates: Partial<Scholarship>): Promise<Scholarship | null> {
    const today = new Date().toISOString().split('T')[0];

    // Fetch existing scholarship to check previous title and slug
    let existingScholarship: Scholarship | null = null;
    if (isSupabaseConfigured() && supabase) {
      const { data: existingRow } = await supabase
        .from('scholarships')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (existingRow) {
        existingScholarship = mapDbToScholarship(existingRow);
      }
    }

    if (!existingScholarship) {
      const local = getLocalScholarships();
      existingScholarship = local.find((s) => s.id === id) || null;
    }

    let targetSlug = updates.slug;

    if (updates.title && existingScholarship) {
      const oldTitle = existingScholarship.title ? existingScholarship.title.trim() : '';
      const newTitle = updates.title.trim();

      if (newTitle !== oldTitle) {
        // Title changed! Generate unique slug excluding this scholarship's ID
        targetSlug = await generateUniqueSlug(newTitle, id);
      } else {
        // Title did NOT change - preserve existing slug unless updates.slug was explicitly set
        targetSlug = targetSlug || existingScholarship.slug;
      }
    } else if (!targetSlug && existingScholarship) {
      targetSlug = existingScholarship.slug;
    }

    let attempts = 0;
    const maxAttempts = 10;
    let currentSlug = targetSlug;

    while (attempts < maxAttempts) {
      attempts++;
      const finalUpdates = { ...updates };
      if (currentSlug) {
        finalUpdates.slug = currentSlug;
      }

      if (isSupabaseConfigured() && supabase) {
        const dbPayload = mapScholarshipToDb(finalUpdates);
        dbPayload.updated_at = new Date().toISOString();

        const { data: updated, error } = await supabase
          .from('scholarships')
          .update(dbPayload)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          const isDuplicateKey = error.code === '23505' ||
            error.message.includes('unique constraint') ||
            error.message.includes('duplicate key') ||
            error.message.includes('scholarships_slug_key');

          if (isDuplicateKey && attempts < maxAttempts && updates.title) {
            currentSlug = await generateUniqueSlug(`${updates.title}-${attempts + 1}`, id);
            continue;
          }
          console.warn('Supabase update failed, storing locally:', error.message);
        } else if (updated) {
          return mapDbToScholarship(updated);
        }
      }

      const local = getLocalScholarships();
      const index = local.findIndex((s) => s.id === id);
      if (index === -1) return null;

      const updatedItem: Scholarship = {
        ...local[index],
        ...finalUpdates,
        updatedAt: today,
        lastVerified: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      };

      local[index] = updatedItem;
      saveLocalScholarships(local);
      return updatedItem;
    }

    throw new Error('Failed to update scholarship due to recurring slug conflicts.');
  },

  async archiveOrDeleteScholarship(id: string, mode: 'archive' | 'delete'): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      if (mode === 'delete') {
        const { error } = await supabase.from('scholarships').delete().eq('id', id);
        if (error) throw new Error(`Database delete error: ${error.message}`);
        return true;
      } else {
        const { error } = await supabase.from('scholarships').update({ status: 'Archived', updated_at: new Date().toISOString() }).eq('id', id);
        if (error) throw new Error(`Database archive error: ${error.message}`);
        return true;
      }
    }

    const local = getLocalScholarships();
    if (mode === 'delete') {
      const filtered = local.filter((s) => s.id !== id);
      saveLocalScholarships(filtered);
    } else {
      const item = local.find((s) => s.id === id);
      if (item) {
        item.status = 'Archived';
        saveLocalScholarships(local);
      }
    }
    return true;
  },

  // Cover Image Upload to scholarship-covers bucket
  async uploadCoverImage(file: File): Promise<string> {
    if (isSupabaseConfigured() && supabase) {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `cover-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const { error } = await supabase.storage
        .from('scholarship-covers')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        throw new Error(`Cover image upload failed: ${error.message}`);
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

  // Field Management Methods
  async getFields(): Promise<FieldItem[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('fields').select('*');
      if (!error && data && data.length > 0) {
        return data as FieldItem[];
      }
    }
    return getLocalFields();
  },

  async saveField(field: Omit<FieldItem, 'id'> & { id?: string }): Promise<FieldItem> {
    if (field.name.trim().toLowerCase() === ALL_FIELDS.toLowerCase()) {
      throw new Error(`"${ALL_FIELDS}" is a reserved scholarship option and is not stored as an academic field.`);
    }

    const newField: FieldItem = {
      id: field.id || field.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: field.name,
      description: field.description,
      status: field.status || 'Active',
    };

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('fields').upsert(newField);
      if (error) {
        throw new Error(`Failed to save field: ${error.message}`);
      }
    }

    const local = getLocalFields();
    const existingIndex = local.findIndex((f) => f.id === newField.id);
    if (existingIndex !== -1) {
      local[existingIndex] = newField;
    } else {
      local.push(newField);
    }
    saveLocalFields(local);
    return newField;
  },

  async toggleFieldStatus(id: string): Promise<FieldItem | null> {
    const fields = await this.getFields();
    const field = fields.find((f) => f.id === id);
    if (!field) return null;

    const newStatus: 'Active' | 'Disabled' = field.status === 'Active' ? 'Disabled' : 'Active';
    field.status = newStatus;

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('fields').upsert({
        id: field.id,
        name: field.name,
        description: field.description,
        status: newStatus,
      });
      if (error) {
        throw new Error(`Failed to update field status: ${error.message}`);
      }
    }

    const local = getLocalFields();
    const existingIndex = local.findIndex((f) => f.id === id);
    if (existingIndex !== -1) {
      local[existingIndex].status = newStatus;
      saveLocalFields(local);
    }
    return field;
  },

  // Site Settings Methods
  async getSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'default').maybeSingle();
      if (!error && data) {
        return {
          siteName: data.site_name,
          contactEmail: data.contact_email,
          maintenanceMode: data.maintenance_mode,
        };
      }
    }
    return getLocalSettings();
  },

  async saveSettings(settings: SiteSettings): Promise<SiteSettings> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('site_settings').upsert({
        id: 'default',
        site_name: settings.siteName,
        contact_email: settings.contactEmail,
        maintenance_mode: settings.maintenanceMode,
      });
      if (error) {
        throw new Error(`Failed to save site settings: ${error.message}`);
      }
    }

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    return settings;
  }
};
