export type DegreeLevel = 'Undergraduate' | "Master's" | 'Postgraduate' | 'PhD';
export type FundingType = 'Fully Funded' | 'Partially Funded' | 'Tuition Only';
export type ScholarshipStatus = 'Published' | 'Draft' | 'Archived';

export interface Scholarship {
  id: string;
  title: string;
  slug: string;
  organization: string;
  country: string;
  studyDestination: string;
  degreeLevel: DegreeLevel;
  fieldOfStudy: string;
  fundingType: FundingType;
  amount: string;
  deadline: string; // ISO Date YYYY-MM-DD
  eligibleCountries: string;
  description: string;
  benefits: string[];
  eligibility: string[];
  requirements: string[];
  applicationInstructions: string[];
  applicationUrl: string;
  sourceUrl?: string;
  dateAdded: string; // ISO Date YYYY-MM-DD
  lastVerified: string;
  featured?: boolean;
  imageUrl?: string;
  status?: ScholarshipStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface FilterState {
  searchQuery: string;
  country: string;
  degree: string;
  field: string;
  funding: string;
}

export interface FieldItem {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Disabled';
  scholarshipCount?: number;
}

export interface SiteSettings {
  siteName: string;
  contactEmail: string;
  maintenanceMode: boolean;
}

export type PromotionPlacement = 'Homepage' | 'Scholarship Details' | 'Both';
export type PromotionStatus = 'Active' | 'Inactive';

export interface AffiliatePromotion {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  destinationUrl?: string;
  placement: PromotionPlacement;
  status: PromotionStatus;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}
