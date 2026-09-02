export interface HomepageField {
  id: string;
  title: string;
  count: string;
  description: string;
  field: string;
  icon: string;
}

export interface FieldMajor {
  name: string;
  slug: string;
  fieldFilter: string;
}

export interface FieldCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  majors: FieldMajor[];
}

export const ALL_FIELDS = 'All Fields';

export class HomepageFieldsData {
  // 9 Major Fields for Homepage
  static HOMEPAGE_FIELDS: HomepageField[] = [
    {
      id: 'cs-it',
      title: 'Computer Science & IT',
      count: '0 Scholarships',
      description: 'Software engineering, AI, cybersecurity, and data science awards',
      field: 'Computer Science',
      icon: 'Code'
    },
    {
      id: 'engineering',
      title: 'Engineering',
      count: '0 Scholarships',
      description: 'Mechanical, civil, electrical, chemical & aerospace engineering',
      field: 'Engineering',
      icon: 'Cpu'
    },
    {
      id: 'medicine-health',
      title: 'Medicine & Health',
      count: '0 Scholarships',
      description: 'Clinical medicine, nursing, public health & biomedical sciences',
      field: 'Medicine',
      icon: 'Activity'
    },
    {
      id: 'business-management',
      title: 'Business & Management',
      count: '0 Scholarships',
      description: 'Business administration, MBA, accounting, finance & marketing',
      field: 'Business',
      icon: 'Briefcase'
    },
    {
      id: 'law',
      title: 'Law',
      count: '0 Scholarships',
      description: 'International law, human rights, commercial law & corporate policy',
      field: 'Law',
      icon: 'Scale'
    },
    {
      id: 'economics',
      title: 'Economics',
      count: '0 Scholarships',
      description: 'Macroeconomics, financial economics, banking & development policy',
      field: 'Economics',
      icon: 'TrendingUp'
    },
    {
      id: 'natural-sciences',
      title: 'Natural Sciences',
      count: '0 Scholarships',
      description: 'Biology, chemistry, physics, mathematics & biotechnology',
      field: 'Natural Sciences',
      icon: 'Sparkles'
    },
    {
      id: 'social-sciences',
      title: 'Social Sciences',
      count: '0 Scholarships',
      description: 'Psychology, sociology, political science & international relations',
      field: 'Social Sciences',
      icon: 'Globe'
    },
    {
      id: 'arts-design',
      title: 'Arts & Design',
      count: '0 Scholarships',
      description: 'Fine arts, graphic design, architecture, literature & media',
      field: 'Arts',
      icon: 'Palette'
    }
  ];

  static ALL_CATEGORIES: FieldCategory[] = [
    {
      id: 'cs-it',
      name: 'Computer Science & Information Technology',
      description: 'Software development, artificial intelligence, cybersecurity, computing systems, and data analytics.',
      icon: 'Code',
      majors: [
        { name: 'Computer Science', slug: 'computer-science', fieldFilter: 'Computer Science' },
        { name: 'Information Technology', slug: 'information-technology', fieldFilter: 'Computer Science' },
        { name: 'Software Engineering', slug: 'software-engineering', fieldFilter: 'Computer Science' },
        { name: 'Computer Engineering', slug: 'computer-engineering', fieldFilter: 'Computer Science' },
        { name: 'Information Systems', slug: 'information-systems', fieldFilter: 'Computer Science' },
        { name: 'Cybersecurity', slug: 'cybersecurity', fieldFilter: 'Computer Science' },
        { name: 'Data Science', slug: 'data-science', fieldFilter: 'Computer Science' },
        { name: 'Artificial Intelligence', slug: 'artificial-intelligence', fieldFilter: 'Computer Science' },
        { name: 'Machine Learning', slug: 'machine-learning', fieldFilter: 'Computer Science' },
        { name: 'Computer Networks', slug: 'computer-networks', fieldFilter: 'Computer Science' },
        { name: 'Cloud Computing', slug: 'cloud-computing', fieldFilter: 'Computer Science' },
        { name: 'Web Development', slug: 'web-development', fieldFilter: 'Computer Science' },
        { name: 'Database Systems', slug: 'database-systems', fieldFilter: 'Computer Science' },
        { name: 'Human-Computer Interaction', slug: 'human-computer-interaction', fieldFilter: 'Computer Science' },
        { name: 'Game Development', slug: 'game-development', fieldFilter: 'Computer Science' },
        { name: 'Computer Graphics', slug: 'computer-graphics', fieldFilter: 'Computer Science' },
        { name: 'Information Security', slug: 'information-security', fieldFilter: 'Computer Science' }
      ]
    },
    {
      id: 'engineering',
      name: 'Engineering',
      description: 'Applied physical sciences, design of infrastructure, materials, aerospace, and energy systems.',
      icon: 'Cpu',
      majors: [
        { name: 'Mechanical Engineering', slug: 'mechanical-engineering', fieldFilter: 'Engineering' },
        { name: 'Civil Engineering', slug: 'civil-engineering', fieldFilter: 'Engineering' },
        { name: 'Electrical Engineering', slug: 'electrical-engineering', fieldFilter: 'Engineering' },
        { name: 'Electronics Engineering', slug: 'electronics-engineering', fieldFilter: 'Engineering' },
        { name: 'Chemical Engineering', slug: 'chemical-engineering', fieldFilter: 'Engineering' },
        { name: 'Petroleum Engineering', slug: 'petroleum-engineering', fieldFilter: 'Engineering' },
        { name: 'Biomedical Engineering', slug: 'biomedical-engineering', fieldFilter: 'Engineering' },
        { name: 'Environmental Engineering', slug: 'environmental-engineering', fieldFilter: 'Engineering' },
        { name: 'Industrial Engineering', slug: 'industrial-engineering', fieldFilter: 'Engineering' },
        { name: 'Aerospace Engineering', slug: 'aerospace-engineering', fieldFilter: 'Engineering' },
        { name: 'Agricultural Engineering', slug: 'agricultural-engineering', fieldFilter: 'Engineering' },
        { name: 'Materials Engineering', slug: 'materials-engineering', fieldFilter: 'Engineering' },
        { name: 'Structural Engineering', slug: 'structural-engineering', fieldFilter: 'Engineering' },
        { name: 'Mechatronics Engineering', slug: 'mechatronics-engineering', fieldFilter: 'Engineering' },
        { name: 'Telecommunications Engineering', slug: 'telecommunications-engineering', fieldFilter: 'Engineering' },
        { name: 'Automotive Engineering', slug: 'automotive-engineering', fieldFilter: 'Engineering' },
        { name: 'Nuclear Engineering', slug: 'nuclear-engineering', fieldFilter: 'Engineering' }
      ]
    },
    {
      id: 'medicine-health',
      name: 'Medicine & Health',
      description: 'Clinical medical practice, public healthcare, pharmacology, clinical therapies, and life care.',
      icon: 'Activity',
      majors: [
        { name: 'Medicine', slug: 'medicine', fieldFilter: 'Medicine' },
        { name: 'Nursing', slug: 'nursing', fieldFilter: 'Medicine' },
        { name: 'Pharmacy', slug: 'pharmacy', fieldFilter: 'Medicine' },
        { name: 'Dentistry', slug: 'dentistry', fieldFilter: 'Medicine' },
        { name: 'Public Health', slug: 'public-health', fieldFilter: 'Medicine' },
        { name: 'Medical Laboratory Science', slug: 'medical-laboratory-science', fieldFilter: 'Medicine' },
        { name: 'Physiotherapy', slug: 'physiotherapy', fieldFilter: 'Medicine' },
        { name: 'Radiography', slug: 'radiography', fieldFilter: 'Medicine' },
        { name: 'Nutrition & Dietetics', slug: 'nutrition-dietetics', fieldFilter: 'Medicine' },
        { name: 'Occupational Therapy', slug: 'occupational-therapy', fieldFilter: 'Medicine' },
        { name: 'Biomedical Sciences', slug: 'biomedical-sciences', fieldFilter: 'Medicine' },
        { name: 'Anatomy', slug: 'anatomy', fieldFilter: 'Medicine' },
        { name: 'Physiology', slug: 'physiology', fieldFilter: 'Medicine' },
        { name: 'Health Administration', slug: 'health-administration', fieldFilter: 'Medicine' },
        { name: 'Epidemiology', slug: 'epidemiology', fieldFilter: 'Medicine' },
        { name: 'Veterinary Medicine', slug: 'veterinary-medicine', fieldFilter: 'Medicine' }
      ]
    },
    {
      id: 'business-management',
      name: 'Business & Management',
      description: 'Corporate leadership, financial accounting, marketing strategy, supply chain, and commerce.',
      icon: 'Briefcase',
      majors: [
        { name: 'Business Administration', slug: 'business-administration', fieldFilter: 'Business' },
        { name: 'Accounting', slug: 'accounting', fieldFilter: 'Business' },
        { name: 'Finance', slug: 'finance', fieldFilter: 'Business' },
        { name: 'Marketing', slug: 'marketing', fieldFilter: 'Business' },
        { name: 'Economics', slug: 'economics', fieldFilter: 'Economics' },
        { name: 'Management', slug: 'management', fieldFilter: 'Business' },
        { name: 'Entrepreneurship', slug: 'entrepreneurship', fieldFilter: 'Business' },
        { name: 'International Business', slug: 'international-business', fieldFilter: 'Business' },
        { name: 'Human Resource Management', slug: 'human-resource-management', fieldFilter: 'Business' },
        { name: 'Supply Chain Management', slug: 'supply-chain-management', fieldFilter: 'Business' },
        { name: 'Banking', slug: 'banking', fieldFilter: 'Business' },
        { name: 'Insurance', slug: 'insurance', fieldFilter: 'Business' },
        { name: 'Project Management', slug: 'project-management', fieldFilter: 'Business' },
        { name: 'Business Analytics', slug: 'business-analytics', fieldFilter: 'Business' },
        { name: 'Actuarial Science', slug: 'actuarial-science', fieldFilter: 'Business' },
        { name: 'Real Estate', slug: 'real-estate', fieldFilter: 'Business' }
      ]
    },
    {
      id: 'natural-sciences',
      name: 'Natural Sciences',
      description: 'Fundamental research in biological, physical, chemical, mathematical, and environmental systems.',
      icon: 'Sparkles',
      majors: [
        { name: 'Biology', slug: 'biology', fieldFilter: 'Natural Sciences' },
        { name: 'Chemistry', slug: 'chemistry', fieldFilter: 'Natural Sciences' },
        { name: 'Physics', slug: 'physics', fieldFilter: 'Natural Sciences' },
        { name: 'Mathematics', slug: 'mathematics', fieldFilter: 'Natural Sciences' },
        { name: 'Statistics', slug: 'statistics', fieldFilter: 'Natural Sciences' },
        { name: 'Biochemistry', slug: 'biochemistry', fieldFilter: 'Natural Sciences' },
        { name: 'Microbiology', slug: 'microbiology', fieldFilter: 'Natural Sciences' },
        { name: 'Biotechnology', slug: 'biotechnology', fieldFilter: 'Natural Sciences' },
        { name: 'Environmental Science', slug: 'environmental-science', fieldFilter: 'Natural Sciences' },
        { name: 'Geology', slug: 'geology', fieldFilter: 'Natural Sciences' },
        { name: 'Geophysics', slug: 'geophysics', fieldFilter: 'Natural Sciences' },
        { name: 'Astronomy', slug: 'astronomy', fieldFilter: 'Natural Sciences' },
        { name: 'Marine Science', slug: 'marine-science', fieldFilter: 'Natural Sciences' },
        { name: 'Ecology', slug: 'ecology', fieldFilter: 'Natural Sciences' },
        { name: 'Zoology', slug: 'zoology', fieldFilter: 'Natural Sciences' },
        { name: 'Botany', slug: 'botany', fieldFilter: 'Natural Sciences' }
      ]
    },
    {
      id: 'social-sciences',
      name: 'Social Sciences',
      description: 'Study of human behavior, societal structures, global politics, economics, and culture.',
      icon: 'Globe',
      majors: [
        { name: 'Psychology', slug: 'psychology', fieldFilter: 'Social Sciences' },
        { name: 'Sociology', slug: 'sociology', fieldFilter: 'Social Sciences' },
        { name: 'Political Science', slug: 'political-science', fieldFilter: 'Social Sciences' },
        { name: 'International Relations', slug: 'international-relations', fieldFilter: 'Social Sciences' },
        { name: 'Anthropology', slug: 'anthropology', fieldFilter: 'Social Sciences' },
        { name: 'Geography', slug: 'geography', fieldFilter: 'Social Sciences' },
        { name: 'Social Work', slug: 'social-work', fieldFilter: 'Social Sciences' },
        { name: 'Development Studies', slug: 'development-studies', fieldFilter: 'Social Sciences' },
        { name: 'Criminology', slug: 'criminology', fieldFilter: 'Social Sciences' },
        { name: 'Demography', slug: 'demography', fieldFilter: 'Social Sciences' },
        { name: 'International Development', slug: 'international-development', fieldFilter: 'Social Sciences' },
        { name: 'Public Policy', slug: 'public-policy', fieldFilter: 'Social Sciences' },
        { name: 'Peace & Conflict Studies', slug: 'peace-conflict-studies', fieldFilter: 'Social Sciences' }
      ]
    },
    {
      id: 'arts-humanities-design',
      name: 'Arts, Humanities & Design',
      description: 'Creative arts, visual communication, design disciplines, history, philosophy, and literature.',
      icon: 'Palette',
      majors: [
        { name: 'Fine Arts', slug: 'fine-arts', fieldFilter: 'Arts' },
        { name: 'Graphic Design', slug: 'graphic-design', fieldFilter: 'Arts' },
        { name: 'Industrial Design', slug: 'industrial-design', fieldFilter: 'Arts' },
        { name: 'Fashion Design', slug: 'fashion-design', fieldFilter: 'Arts' },
        { name: 'Interior Design', slug: 'interior-design', fieldFilter: 'Arts' },
        { name: 'Animation', slug: 'animation', fieldFilter: 'Arts' },
        { name: 'Film & Television', slug: 'film-television', fieldFilter: 'Arts' },
        { name: 'Photography', slug: 'photography', fieldFilter: 'Arts' },
        { name: 'Music', slug: 'music', fieldFilter: 'Arts' },
        { name: 'Theatre', slug: 'theatre', fieldFilter: 'Arts' },
        { name: 'History', slug: 'history', fieldFilter: 'Arts' },
        { name: 'Philosophy', slug: 'philosophy', fieldFilter: 'Arts' },
        { name: 'Literature', slug: 'literature', fieldFilter: 'Arts' },
        { name: 'Linguistics', slug: 'linguistics', fieldFilter: 'Arts' },
        { name: 'Religious Studies', slug: 'religious-studies', fieldFilter: 'Arts' },
        { name: 'Cultural Studies', slug: 'cultural-studies', fieldFilter: 'Arts' },
        { name: 'Architecture', slug: 'architecture', fieldFilter: 'Arts' }
      ]
    },
    {
      id: 'communication-media',
      name: 'Communication & Media',
      description: 'Journalism, public relations, mass media, digital communication, and advertising.',
      icon: 'BookOpen',
      majors: [
        { name: 'Mass Communication', slug: 'mass-communication', fieldFilter: 'Arts' },
        { name: 'Journalism', slug: 'journalism', fieldFilter: 'Arts' },
        { name: 'Public Relations', slug: 'public-relations', fieldFilter: 'Business' },
        { name: 'Media Studies', slug: 'media-studies', fieldFilter: 'Arts' },
        { name: 'Broadcasting', slug: 'broadcasting', fieldFilter: 'Arts' },
        { name: 'Digital Media', slug: 'digital-media', fieldFilter: 'Arts' },
        { name: 'Advertising', slug: 'advertising', fieldFilter: 'Business' },
        { name: 'Film Production', slug: 'film-production', fieldFilter: 'Arts' },
        { name: 'Communication Studies', slug: 'communication-studies', fieldFilter: 'Arts' }
      ]
    },
    {
      id: 'education',
      name: 'Education',
      description: 'Pedagogy, curriculum design, educational leadership, special needs education, and learning technologies.',
      icon: 'GraduationCap',
      majors: [
        { name: 'Early Childhood Education', slug: 'early-childhood-education', fieldFilter: 'Social Sciences' },
        { name: 'Primary Education', slug: 'primary-education', fieldFilter: 'Social Sciences' },
        { name: 'Secondary Education', slug: 'secondary-education', fieldFilter: 'Social Sciences' },
        { name: 'Special Education', slug: 'special-education', fieldFilter: 'Social Sciences' },
        { name: 'Educational Psychology', slug: 'educational-psychology', fieldFilter: 'Social Sciences' },
        { name: 'Educational Technology', slug: 'educational-technology', fieldFilter: 'Computer Science' },
        { name: 'Mathematics Education', slug: 'mathematics-education', fieldFilter: 'Natural Sciences' },
        { name: 'Science Education', slug: 'science-education', fieldFilter: 'Natural Sciences' },
        { name: 'English Education', slug: 'english-education', fieldFilter: 'Arts' },
        { name: 'Educational Administration', slug: 'educational-administration', fieldFilter: 'Business' },
        { name: 'Curriculum Studies', slug: 'curriculum-studies', fieldFilter: 'Social Sciences' }
      ]
    },
    {
      id: 'law-legal',
      name: 'Law & Legal Studies',
      description: 'Jurisprudence, international legal policy, human rights protection, corporate governance, and criminal justice.',
      icon: 'Scale',
      majors: [
        { name: 'Law', slug: 'law', fieldFilter: 'Law' },
        { name: 'International Law', slug: 'international-law', fieldFilter: 'Law' },
        { name: 'Human Rights Law', slug: 'human-rights-law', fieldFilter: 'Law' },
        { name: 'Commercial Law', slug: 'commercial-law', fieldFilter: 'Law' },
        { name: 'Corporate Law', slug: 'corporate-law', fieldFilter: 'Law' },
        { name: 'Criminal Law', slug: 'criminal-law', fieldFilter: 'Law' },
        { name: 'Constitutional Law', slug: 'constitutional-law', fieldFilter: 'Law' },
        { name: 'Intellectual Property Law', slug: 'intellectual-property-law', fieldFilter: 'Law' },
        { name: 'Environmental Law', slug: 'environmental-law', fieldFilter: 'Law' },
        { name: 'International Humanitarian Law', slug: 'international-humanitarian-law', fieldFilter: 'Law' }
      ]
    },
    {
      id: 'agriculture-environment',
      name: 'Agriculture & Environment',
      description: 'Agronomy, sustainable farming, soil science, forestry, natural resources, and food technology.',
      icon: 'Sparkles',
      majors: [
        { name: 'Agriculture', slug: 'agriculture', fieldFilter: 'Natural Sciences' },
        { name: 'Agricultural Economics', slug: 'agricultural-economics', fieldFilter: 'Economics' },
        { name: 'Agronomy', slug: 'agronomy', fieldFilter: 'Natural Sciences' },
        { name: 'Animal Science', slug: 'animal-science', fieldFilter: 'Natural Sciences' },
        { name: 'Crop Science', slug: 'crop-science', fieldFilter: 'Natural Sciences' },
        { name: 'Soil Science', slug: 'soil-science', fieldFilter: 'Natural Sciences' },
        { name: 'Forestry', slug: 'forestry', fieldFilter: 'Natural Sciences' },
        { name: 'Fisheries', slug: 'fisheries', fieldFilter: 'Natural Sciences' },
        { name: 'Horticulture', slug: 'horticulture', fieldFilter: 'Natural Sciences' },
        { name: 'Agricultural Extension', slug: 'agricultural-extension', fieldFilter: 'Social Sciences' },
        { name: 'Food Science', slug: 'food-science', fieldFilter: 'Natural Sciences' },
        { name: 'Environmental Management', slug: 'environmental-management', fieldFilter: 'Natural Sciences' },
        { name: 'Natural Resource Management', slug: 'natural-resource-management', fieldFilter: 'Natural Sciences' }
      ]
    },
    {
      id: 'architecture-built-environment',
      name: 'Architecture & Built Environment',
      description: 'Architectural design, urban planning, construction management, surveying, and estate development.',
      icon: 'Cpu',
      majors: [
        { name: 'Architecture', slug: 'architecture', fieldFilter: 'Arts' },
        { name: 'Urban Planning', slug: 'urban-planning', fieldFilter: 'Social Sciences' },
        { name: 'Urban Design', slug: 'urban-design', fieldFilter: 'Arts' },
        { name: 'Quantity Surveying', slug: 'quantity-surveying', fieldFilter: 'Engineering' },
        { name: 'Building Technology', slug: 'building-technology', fieldFilter: 'Engineering' },
        { name: 'Construction Management', slug: 'construction-management', fieldFilter: 'Business' },
        { name: 'Estate Management', slug: 'estate-management', fieldFilter: 'Business' },
        { name: 'Landscape Architecture', slug: 'landscape-architecture', fieldFilter: 'Arts' },
        { name: 'Surveying & Geoinformatics', slug: 'surveying-geoinformatics', fieldFilter: 'Engineering' }
      ]
    },
    {
      id: 'hospitality-tourism',
      name: 'Hospitality & Tourism',
      description: 'Hotel operations, international tourism development, event planning, and culinary management.',
      icon: 'Briefcase',
      majors: [
        { name: 'Hospitality Management', slug: 'hospitality-management', fieldFilter: 'Business' },
        { name: 'Tourism Management', slug: 'tourism-management', fieldFilter: 'Business' },
        { name: 'Hotel Management', slug: 'hotel-management', fieldFilter: 'Business' },
        { name: 'Travel & Tourism', slug: 'travel-tourism', fieldFilter: 'Business' },
        { name: 'Event Management', slug: 'event-management', fieldFilter: 'Business' },
        { name: 'Culinary Arts', slug: 'culinary-arts', fieldFilter: 'Arts' }
      ]
    }
  ];
}
