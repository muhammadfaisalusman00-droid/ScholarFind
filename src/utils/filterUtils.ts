import { Scholarship, FilterState } from '../types/scholarship';
import { ALL_FIELDS } from '../data/fieldsData';

export function filterScholarships(scholarships: Scholarship[], filters: FilterState): Scholarship[] {
  return scholarships.filter((item) => {
    // 1. Search Query
    if (filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchesTitle = item.title.toLowerCase().includes(q);
      const matchesOrg = item.organization.toLowerCase().includes(q);
      const matchesCountry = item.country.toLowerCase().includes(q);
      const matchesField = item.fieldOfStudy.toLowerCase().includes(q);
      const matchesDesc = item.description.toLowerCase().includes(q);
      const matchesDegree = item.degreeLevel.toLowerCase().includes(q);
      if (!matchesTitle && !matchesOrg && !matchesCountry && !matchesField && !matchesDesc && !matchesDegree) {
        return false;
      }
    }

    // 2. Country
    if (filters.country && filters.country !== 'Any country' && filters.country !== 'All') {
      if (filters.country === 'International') {
        if (!item.eligibleCountries.toLowerCase().includes('international') && !item.country.toLowerCase().includes('international')) {
          return false;
        }
      } else {
        if (item.country.toLowerCase() !== filters.country.toLowerCase() && item.studyDestination.toLowerCase() !== filters.country.toLowerCase()) {
          return false;
        }
      }
    }

    // 3. Degree Level
    if (filters.degree && filters.degree !== 'Any degree' && filters.degree !== 'All') {
      const selectedDegree = filters.degree.toLowerCase();
      const itemDegree = item.degreeLevel.toLowerCase();
      if (selectedDegree === 'postgraduate') {
        if (itemDegree !== 'postgraduate' && itemDegree !== "master's" && itemDegree !== 'phd' && itemDegree !== 'postdoctoral') {
          return false;
        }
      } else if (itemDegree !== selectedDegree) {
        return false;
      }
    }

    // 4. Funding Type
    if (filters.funding && filters.funding !== 'Any funding' && filters.funding !== 'All') {
      if (item.fundingType.toLowerCase() !== filters.funding.toLowerCase()) {
        return false;
      }
    }

    // 5. Field of Study
    if (filters.field && filters.field !== 'Any field' && filters.field !== 'All' && filters.field !== ALL_FIELDS) {
      const selectedField = filters.field.toLowerCase().trim();
      const itemField = item.fieldOfStudy.toLowerCase().trim();
      if (itemField !== selectedField && itemField !== ALL_FIELDS.toLowerCase()) {
        return false;
      }
    }

    return true;
  });
}
