import { Scholarship } from '../types/scholarship';

/**
 * ScholarFind Mock Dataset
 * Note: These records are realistic sample data generated for prototype demonstration.
 */
export const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'sf-001',
    title: 'Global STEM Leaders Excellence Scholarship',
    slug: 'global-stem-leaders-excellence-scholarship',
    organization: 'International Scholars Institute',
    country: 'United States',
    studyDestination: 'United States',
    degreeLevel: "Postgraduate",
    fieldOfStudy: 'Computer Science',
    fundingType: 'Fully Funded',
    amount: '$52,000 / year + Monthly Stipend',
    deadline: '2026-08-15', // 5 days left
    eligibleCountries: 'International (All Countries)',
    description: 'A prestigious award for exceptional international students pursuing advanced degrees in artificial intelligence, software engineering, and data science.',
    benefits: [
      '100% Tuition coverage for 2 years',
      'Monthly living allowance of $2,200',
      'Round-trip international airfare',
      'Comprehensive health and accident insurance',
      'Dedicated research grant budget ($3,000/year)'
    ],
    eligibility: [
      'Minimum GPA of 3.5 on a 4.0 scale (or equivalent upper second-class honours)',
      'Bachelor’s degree in Computer Science, Mathematics, or related STEM field',
      'Demonstrated leadership or open-source community involvement',
      'IELTS score of 7.0+ or TOEFL iBT 95+'
    ],
    requirements: [
      'Official academic transcripts',
      'Statement of Purpose (1,000 words max)',
      'Two academic letters of recommendation',
      'Curriculum Vitae (CV) / Resume',
      'Proof of English proficiency'
    ],
    applicationInstructions: [
      'Step 1: Complete the online application on the official institute portal.',
      'Step 2: Upload certified copies of academic transcripts and degree certificates.',
      'Step 3: Submit contact details for two academic referees.',
      'Step 4: Shortlisted candidates will be invited for a virtual panel interview.'
    ],
    applicationUrl: 'https://example.org/scholarships/global-stem-2026/apply',
    sourceUrl: 'https://example.org/scholarships/global-stem-2026',
    dateAdded: '2026-07-20',
    lastVerified: 'August 10, 2026',
    featured: true
  },
  {
    id: 'sf-002',
    title: 'DAAD International Master’s Fellowship in Innovation',
    slug: 'daad-masters-fellowship-germany',
    organization: 'Global Excellence Foundation',
    country: 'Germany',
    studyDestination: 'Germany',
    degreeLevel: "Master's",
    fieldOfStudy: 'Engineering',
    fundingType: 'Fully Funded',
    amount: '€934 / month + Full Tuition Waiver',
    deadline: '2026-08-22', // 12 days left
    eligibleCountries: 'Developing & Emerging Economies',
    description: 'Designed for high-achieving engineers seeking to complete specialized Master’s programs across public German universities.',
    benefits: [
      'Full tuition fee waiver for all participating state universities',
      'Monthly stipend of €934',
      'Travel grant for flight expenses',
      'Annual research allowance of €460',
      'Intensive German language course (2 months prior to program)'
    ],
    eligibility: [
      'Bachelor’s degree in Engineering or Applied Sciences',
      'At least 2 years of professional work experience in a related domain',
      'Academic degree awarded within the last 6 years',
      'Proficiency in English or German depending on program language'
    ],
    requirements: [
      'DAAD application form',
      'Hand-signed CV (Europass format)',
      'Motivation letter stating career and development goals',
      'Letter of recommendation from current employer'
    ],
    applicationInstructions: [
      'Submit your application dossier directly through the scholarship portal before the deadline.',
      'Ensure all non-English or non-German documents are officially translated.'
    ],
    applicationUrl: 'https://example.org/germany-engineering-fellowship/apply',
    sourceUrl: 'https://example.org/germany-engineering-fellowship',
    dateAdded: '2026-07-15',
    lastVerified: 'August 10, 2026',
    featured: true
  },
  {
    id: 'sf-003',
    title: 'Chevening UK Government Future Leaders Award',
    slug: 'chevening-uk-government-future-leaders',
    organization: 'Future Leaders Foundation',
    country: 'United Kingdom',
    studyDestination: 'United Kingdom',
    degreeLevel: "Postgraduate",
    fieldOfStudy: 'Business',
    fundingType: 'Fully Funded',
    amount: 'Full Tuition + £1,300 Monthly Stipend',
    deadline: '2026-08-25', // 15 days left
    eligibleCountries: 'International (160+ eligible countries)',
    description: 'A global scholarship program funded by the Foreign, Commonwealth & Development Office, empowering future leaders to undertake one-year Master’s degrees in the UK.',
    benefits: [
      'Full university tuition fees waiver',
      'Monthly living allowance (£1,300 - £1,600/mo depending on location)',
      'Economy class travel to and from the UK',
      'Arrival allowance and departure allowance',
      'Access to exclusive leadership seminars and networking receptions'
    ],
    eligibility: [
      'Undergraduate degree with upper second-class 2:1 honours or equivalent',
      'At least 2 years of work experience (equivalent to 2,800 hours)',
      'Return to home country for at least 2 years after completing studies',
      'Apply to three eligible UK university courses'
    ],
    requirements: [
      'Two references submitted in English',
      'Valid passport or national ID',
      'University offer letters (unconditional preferred)',
      'Four essay responses on leadership, networking, studying in UK, and career plan'
    ],
    applicationInstructions: [
      'Register on the official web portal.',
      'Select your target UK Master’s programs.',
      'Complete the mandatory essay prompt questions.',
      'Submit certified credentials before the closing date.'
    ],
    applicationUrl: 'https://example.org/chevening-scholars-2026/apply',
    sourceUrl: 'https://example.org/chevening-scholars-2026',
    dateAdded: '2026-07-28',
    lastVerified: 'August 10, 2026',
    featured: true
  },
  {
    id: 'sf-004',
    title: 'University of Toronto Graduate Research Fellowship',
    slug: 'university-of-toronto-graduate-fellowship',
    organization: 'Canadian Academic Trust',
    country: 'Canada',
    studyDestination: 'Canada',
    degreeLevel: 'PhD',
    fieldOfStudy: 'Computer Science',
    fundingType: 'Fully Funded',
    amount: 'CAD $38,000 / year + Tuition',
    deadline: '2026-09-10', // 31 days left
    eligibleCountries: 'International (All Countries)',
    description: 'Awarded to doctoral scholars carrying out high-impact research in machine learning, human-computer interaction, and quantum computing.',
    benefits: [
      '100% Academic tuition & mandatory incidental fees',
      'CAD $38,000 annual guaranteed living stipend for up to 4 years',
      'University Health Insurance Plan (UHIP) coverage',
      'Conference travel allowance ($2,500/year)'
    ],
    eligibility: [
      'Master’s degree or direct-entry Bachelor’s with exceptional distinction',
      'Minimum A- average in last two years of study',
      'Strong research proposal aligned with faculty supervisors',
      'English proficiency (TOEFL 100 or IELTS 7.5)'
    ],
    requirements: [
      'Research statement and published paper samples',
      'Three academic references',
      'Official transcripts from all post-secondary institutions',
      'GRE General test scores (optional but recommended)'
    ],
    applicationInstructions: [
      'Identify a potential faculty supervisor at the university.',
      'Submit the School of Graduate Studies online application form.'
    ],
    applicationUrl: 'https://example.org/utoronto-grad-fellowship/apply',
    sourceUrl: 'https://example.org/utoronto-grad-fellowship',
    dateAdded: '2026-08-01',
    lastVerified: 'August 10, 2026',
    featured: false
  },
  {
    id: 'sf-005',
    title: 'ETH Zurich Excellence Master’s Scholarship',
    slug: 'eth-zurich-excellence-masters-scholarship',
    organization: 'European Education Initiative',
    country: 'Switzerland',
    studyDestination: 'Switzerland',
    degreeLevel: "Postgraduate",
    fieldOfStudy: 'Engineering',
    fundingType: 'Fully Funded',
    amount: 'CHF 12,000 / semester + Tuition Waiver',
    deadline: '2026-08-18', // 8 days left
    eligibleCountries: 'International (All Countries)',
    description: 'Supports outstanding students wishing to pursue their Master’s degree at ETH Zurich with full study and living support.',
    benefits: [
      'Living and study allowance of CHF 12,000 per semester',
      'Exemption from tuition fees',
      'Individual mentoring and integration into university leadership network'
    ],
    eligibility: [
      'Very good result in Bachelor’s degree (top 10% of class)',
      'Pre-requisite academic qualifications for the selected Master’s program',
      'English language proficiency at level C1'
    ],
    requirements: [
      'Pre-proposal for Master’s thesis',
      'Two letters of recommendation from professors',
      'Curriculum Vitae',
      'Transcripts of records'
    ],
    applicationInstructions: [
      'Apply online via ESOP application portal when submitting Master program application.'
    ],
    applicationUrl: 'https://example.org/eth-zurich-master/apply',
    sourceUrl: 'https://example.org/eth-zurich-master',
    dateAdded: '2026-08-02',
    lastVerified: 'August 10, 2026',
    featured: true
  },
  {
    id: 'sf-006',
    title: 'Global Health & Medical Sciences Undergraduate Grant',
    slug: 'global-health-medical-sciences-grant',
    organization: 'World Health Discovery Network',
    country: 'United Kingdom',
    studyDestination: 'United Kingdom',
    degreeLevel: 'Undergraduate',
    fieldOfStudy: 'Medicine',
    fundingType: 'Partially Funded',
    amount: '£15,000 / year Tuition Credit',
    deadline: '2026-09-01', // 22 days left
    eligibleCountries: 'International (All Countries)',
    description: 'Designed to inspire future clinicians and public health researchers by offering tuition subsidy for UK undergraduate medical programs.',
    benefits: [
      '£15,000 annual discount applied directly to university tuition fees',
      'Clinical placement support across NHS partner teaching hospitals',
      'Mentorship from senior medical consultants'
    ],
    eligibility: [
      'High school diploma with A*AA in Chemistry and Biology/Maths',
      'UCAT score in the top 20th percentile',
      'Demonstrated commitment to medical volunteering'
    ],
    requirements: [
      'UCAS application record',
      'Personal statement detailing passion for clinical medicine',
      'High school academic transcript',
      'Recommendation from secondary school principal'
    ],
    applicationInstructions: [
      'Apply via UCAS selecting partner UK university medical schools.',
      'Submit supplementary grant application on the foundation page.'
    ],
    applicationUrl: 'https://example.org/uk-med-grant/apply',
    sourceUrl: 'https://example.org/uk-med-grant',
    dateAdded: '2026-08-04',
    lastVerified: 'August 10, 2026',
    featured: false
  },
  {
    id: 'sf-007',
    title: 'Monash International Merit Scholarship',
    slug: 'monash-international-merit-scholarship-australia',
    organization: 'Global Excellence Foundation',
    country: 'Australia',
    studyDestination: 'Australia',
    degreeLevel: 'Undergraduate',
    fieldOfStudy: 'Business',
    fundingType: 'Partially Funded',
    amount: '$10,000 / year (up to $40,000 total)',
    deadline: '2026-10-15', // 66 days left
    eligibleCountries: 'International (All Countries)',
    description: 'Encourages high-achieving international students to study undergraduate business, finance, and marketing programs in Melbourne.',
    benefits: [
      '$10,000 paid per annum towards tuition fees',
      'Priority access to global student exchange programs',
      'Invitation to Monash Student Leadership Seminar series'
    ],
    eligibility: [
      'Achieve ATAR 90+ or equivalent international senior high qualification',
      'Maintain a minimum 70% weighted average mark each academic year',
      'Enrolled full-time in an undergraduate degree'
    ],
    requirements: [
      '500-word statement demonstrating how the scholarship will help you become an ambassador',
      'Certified high school completion certificate'
    ],
    applicationInstructions: [
      'Submit scholarship application form after receiving a full offer of admission.'
    ],
    applicationUrl: 'https://example.org/monash-merit-scholarship/apply',
    sourceUrl: 'https://example.org/monash-merit-scholarship',
    dateAdded: '2026-08-05',
    lastVerified: 'August 10, 2026',
    featured: false
  },
  {
    id: 'sf-008',
    title: 'MEXT Japanese Government Undergraduate Scholarship',
    slug: 'mext-japanese-government-undergraduate-scholarship',
    organization: 'International Scholars Institute',
    country: 'Japan',
    studyDestination: 'Japan',
    degreeLevel: 'Undergraduate',
    fieldOfStudy: 'Computer Science',
    fundingType: 'Fully Funded',
    amount: '¥117,000 / month + Full Tuition + Flights',
    deadline: '2026-08-14', // 4 days left
    eligibleCountries: 'Countries with Japanese Diplomatic Relations',
    description: 'Provides full funding for international students to complete a 5-year undergraduate course in Japan including a 1-year preparatory Japanese language course.',
    benefits: [
      'Full exemption from university entrance and tuition fees',
      'Monthly allowance of ¥117,000',
      'Round-trip transportation flight tickets',
      'Preparatory intensive Japanese language course in Tokyo'
    ],
    eligibility: [
      'Born between April 2, 2001 and April 1, 2008',
      'Completed 12 years of formal school education',
      'Eager to learn Japanese language and culture'
    ],
    requirements: [
      'MEXT Application Form & Placement Preference Form',
      'High school academic transcripts',
      'Medical certificate signed by a licensed physician',
      'Recommendation letter from high school principal'
    ],
    applicationInstructions: [
      'Submit physical or electronic documents to the Embassy of Japan in your home country.',
      'Pass written examination in Mathematics, English, and Japanese.'
    ],
    applicationUrl: 'https://example.org/mext-japan-undergrad/apply',
    sourceUrl: 'https://example.org/mext-japan-undergrad',
    dateAdded: '2026-07-10',
    lastVerified: 'August 10, 2026',
    featured: true
  },
  {
    id: 'sf-009',
    title: 'Stanford Knight-Hennessy Scholars Program',
    slug: 'stanford-knight-hennessy-scholars-program',
    organization: 'Future Leaders Foundation',
    country: 'United States',
    studyDestination: 'United States',
    degreeLevel: 'PhD',
    fieldOfStudy: 'Engineering',
    fundingType: 'Fully Funded',
    amount: 'Full Tuition + Stipend + Living Expenses',
    deadline: '2026-10-08', // 59 days left
    eligibleCountries: 'International (All Countries)',
    description: 'A multicultural community of graduate scholars at Stanford University designed to develop collaborative, visionary leaders.',
    benefits: [
      'Full funding covering tuition and associated fees',
      'Stipend for living and academic expenses (housing, food, books)',
      'Annual travel stipend for one round trip to/from home',
      'Leadership development curriculum at Denning House'
    ],
    eligibility: [
      'Apply to and be accepted into a full-time Stanford graduate degree program',
      'Earned first undergraduate degree within the last 7 years',
      'Demonstrate independence of thought, purposeful leadership, and civic mindset'
    ],
    requirements: [
      'Online application including two essay prompts',
      'Resume/CV outlining activities and leadership experience',
      'Two recommendation letters',
      'Video submission (2 minutes max)'
    ],
    applicationInstructions: [
      'Complete two separate applications: one for Knight-Hennessy Scholars and one for your Stanford graduate program.'
    ],
    applicationUrl: 'https://example.org/knight-hennessy-2026/apply',
    sourceUrl: 'https://example.org/knight-hennessy-2026',
    dateAdded: '2026-07-25',
    lastVerified: 'August 10, 2026',
    featured: true
  },
  {
    id: 'sf-010',
    title: 'Erasmus Mundus Joint Master’s in Data Science & AI',
    slug: 'erasmus-mundus-joint-masters-data-science-ai',
    organization: 'European Education Initiative',
    country: 'Germany',
    studyDestination: 'Germany',
    degreeLevel: "Master's",
    fieldOfStudy: 'Computer Science',
    fundingType: 'Fully Funded',
    amount: '€1,400 / month + Tuition Waiver',
    deadline: '2026-09-15', // 36 days left
    eligibleCountries: 'International (All Countries)',
    description: 'A multi-country European Master program allowing students to study at 2 or 3 leading universities across Germany, France, and Spain.',
    benefits: [
      'Full participation fees waived',
      '€1,400 per month living allowance for up to 24 months',
      'Travel and installation grant (€3,000/year)',
      'Full comprehensive health insurance'
    ],
    eligibility: [
      'Bachelor’s degree in Computer Science, Data Science, or Applied Mathematics',
      'Proficiency in English (C1 level / IELTS 7.0)',
      'Not residing in an EU member state for more than 12 months in past 5 years'
    ],
    requirements: [
      'Motivation letter highlighting interest in mobilities',
      'Two academic recommendation letters',
      'Proof of residence',
      'Official English language test results'
    ],
    applicationInstructions: [
      'Apply through the consortium central portal selecting study track preferences.'
    ],
    applicationUrl: 'https://example.org/erasmus-data-ai/apply',
    sourceUrl: 'https://example.org/erasmus-data-ai',
    dateAdded: '2026-08-03',
    lastVerified: 'August 10, 2026',
    featured: false
  },
  {
    id: 'sf-011',
    title: 'University of Sydney International Research Scholarship',
    slug: 'university-of-sydney-international-research-scholarship',
    organization: 'Global Excellence Foundation',
    country: 'Australia',
    studyDestination: 'Australia',
    degreeLevel: 'PhD',
    fieldOfStudy: 'Medicine',
    fundingType: 'Fully Funded',
    amount: 'AUD $40,109 / year + Tuition Waiver',
    deadline: '2026-08-31', // 21 days left
    eligibleCountries: 'International (All Countries)',
    description: 'Supports high-caliber research candidates undertaking a Doctor of Philosophy or research Master’s degree in biomedicine and public health.',
    benefits: [
      'AUD $40,109 per annum index-linked stipend for up to 3.5 years',
      'Full tuition fee coverage',
      'Single Overseas Student Health Cover (OSHC)',
      'Relocation allowance up to AUD $2,000'
    ],
    eligibility: [
      'High first-class honours degree or Master’s degree with significant research component',
      'Unconditional offer of admission to a PhD program',
      'Demonstrated research publication track record'
    ],
    requirements: [
      'Detailed research proposal approved by lead supervisor',
      'Curriculum Vitae listing peer-reviewed publications',
      'Two referee reports'
    ],
    applicationInstructions: [
      'Select the scholarship check-box when completing the online postgraduate research application.'
    ],
    applicationUrl: 'https://example.org/sydney-research-scholarship/apply',
    sourceUrl: 'https://example.org/sydney-research-scholarship',
    dateAdded: '2026-07-18',
    lastVerified: 'August 10, 2026',
    featured: false
  },
  {
    id: 'sf-012',
    title: 'Gates Cambridge International Scholarship',
    slug: 'gates-cambridge-international-scholarship',
    organization: 'International Scholars Institute',
    country: 'United Kingdom',
    studyDestination: 'United Kingdom',
    degreeLevel: 'PhD',
    fieldOfStudy: 'Arts',
    fundingType: 'Fully Funded',
    amount: 'Full University Tuition + £20,000 Stipend',
    deadline: '2026-10-12', // 63 days left
    eligibleCountries: 'International (Outside UK)',
    description: 'Established by the Bill and Melinda Gates Foundation to build a global network of future leaders committed to improving the lives of others.',
    benefits: [
      'Composition Fee at the appropriate rate',
      'Maintenance allowance of £20,000 per year',
      'One economy single airfare at beginning and end of course',
      'Inbound visa costs & Immigration Health Surcharge'
    ],
    eligibility: [
      'Citizen of any country outside the United Kingdom',
      'Applying for a full-time PhD or one-year postgraduate course at Cambridge',
      'Outstanding intellectual ability and commitment to leadership'
    ],
    requirements: [
      'Gates Cambridge reference in addition to 2 academic references',
      '500-word Gates Cambridge statement',
      'Research proposal (for PhD applicants)'
    ],
    applicationInstructions: [
      'Apply through the University of Cambridge Applicant Portal filling out the funding section.'
    ],
    applicationUrl: 'https://example.org/gates-cambridge-2026/apply',
    sourceUrl: 'https://example.org/gates-cambridge-2026',
    dateAdded: '2026-07-29',
    lastVerified: 'August 10, 2026',
    featured: true
  },
  {
    id: 'sf-013',
    title: 'Rotary Peace Fellowship for Master’s Studies',
    slug: 'rotary-peace-fellowship-masters',
    organization: 'Future Leaders Foundation',
    country: 'United States',
    studyDestination: 'United States',
    degreeLevel: "Master's",
    fieldOfStudy: 'Social Sciences',
    fundingType: 'Fully Funded',
    amount: 'Full Tuition + Housing + Travel Expenses',
    deadline: '2026-09-05', // 26 days left
    eligibleCountries: 'International (All Countries)',
    description: 'Designed for leaders with work experience in peace, conflict resolution, and international development to study at premier peace centers.',
    benefits: [
      'Full tuition and university fees',
      'Room and board accommodation allowance',
      'Round-trip transportation',
      'All internship and field-study expenses covered'
    ],
    eligibility: [
      'Bachelor’s degree with strong academic record',
      'At least 3 years of full-time relevant experience in peace or development work',
      'Proficiency in English'
    ],
    requirements: [
      'Rotary district endorsement',
      'Essays detailing peacebuilding commitment',
      'Three recommendations'
    ],
    applicationInstructions: [
      'Submit application materials through local Rotary district committee review.'
    ],
    applicationUrl: 'https://example.org/rotary-peace-fellows/apply',
    sourceUrl: 'https://example.org/rotary-peace-fellows',
    dateAdded: '2026-08-02',
    lastVerified: 'August 10, 2026',
    featured: false
  },
  {
    id: 'sf-014',
    title: 'Lester B. Pearson International Undergraduate Scholarship',
    slug: 'lester-b-pearson-international-undergraduate-scholarship',
    organization: 'Canadian Academic Trust',
    country: 'Canada',
    studyDestination: 'Canada',
    degreeLevel: 'Undergraduate',
    fieldOfStudy: 'Business',
    fundingType: 'Fully Funded',
    amount: 'Full Tuition + Books + Full Residence',
    deadline: '2026-11-15', // 97 days left
    eligibleCountries: 'International (All Countries)',
    description: 'Recognizes international students who demonstrate exceptional academic achievement, creativity, and impact in their school and community.',
    benefits: [
      'Full tuition for 4 undergraduate study years',
      'Book allowance and incidental fees',
      'Full residence support at University of Toronto campus'
    ],
    eligibility: [
      'International student nominated by high school',
      'Currently in final year of secondary school or graduated no earlier than June 2025',
      'First-time post-secondary student'
    ],
    requirements: [
      'High school nomination form',
      'Pearson scholarship application form',
      'High school transcript and predicted grades'
    ],
    applicationInstructions: [
      'Ask your secondary school to register and submit a nomination.',
      'Upon receiving nomination link, complete student application portal.'
    ],
    applicationUrl: 'https://example.org/pearson-scholars-canada/apply',
    sourceUrl: 'https://example.org/pearson-scholars-canada',
    dateAdded: '2026-08-06',
    lastVerified: 'August 10, 2026',
    featured: false
  },
  {
    id: 'sf-015',
    title: 'Nordic Clean Energy & Sustainability Grant',
    slug: 'nordic-clean-energy-sustainability-grant',
    organization: 'European Education Initiative',
    country: 'Germany',
    studyDestination: 'Germany',
    degreeLevel: "Master's",
    fieldOfStudy: 'Engineering',
    fundingType: 'Partially Funded',
    amount: '€8,000 Annual Tuition Reduction',
    deadline: '2026-09-20', // 41 days left
    eligibleCountries: 'International (All Countries)',
    description: 'Encourages international students to specialize in renewable energy systems, climate technology, and sustainable urban design.',
    benefits: [
      '€8,000 direct tuition reduction per year',
      'Access to green tech laboratory facilities and industry networking days',
      'Subsidized public transit pass'
    ],
    eligibility: [
      'Bachelor in Civil, Mechanical, Environmental or Electrical Engineering',
      'Minimum GPA 3.2 on a 4.0 scale',
      'English proficiency B2/C1'
    ],
    requirements: [
      'CV and academic transcript',
      '1-page essay on Sustainable Innovation proposal'
    ],
    applicationInstructions: [
      'Submit direct application via project website with motivation letter.'
    ],
    applicationUrl: 'https://example.org/nordic-sustainability-grant/apply',
    sourceUrl: 'https://example.org/nordic-sustainability-grant',
    dateAdded: '2026-08-01',
    lastVerified: 'August 10, 2026',
    featured: false
  },
  {
    id: 'sf-016',
    title: 'Fubright Foreign Student Program USA',
    slug: 'fulbright-foreign-student-program-usa',
    organization: 'Global Excellence Foundation',
    country: 'United States',
    studyDestination: 'United States',
    degreeLevel: "Master's",
    fieldOfStudy: 'Social Sciences',
    fundingType: 'Fully Funded',
    amount: 'Full Tuition + Stipend + Airfare + J-1 Visa',
    deadline: '2026-09-30', // 51 days left
    eligibleCountries: '160+ Participating Countries',
    description: 'Enables graduate students, young professionals, and artists from abroad to study and conduct research in the United States.',
    benefits: [
      'Full university tuition fees coverage',
      'Monthly living stipend and health/accident insurance',
      'Round-trip international flight',
      'J-1 Visa sponsorship and orientation seminars'
    ],
    eligibility: [
      'Citizen of participating Fulbright country',
      'Completed undergraduate degree equivalent to a US Bachelor’s',
      'Strong leadership potential and motivation to foster intercultural understanding'
    ],
    requirements: [
      'Fulbright online application dossier',
      '3 letters of recommendation',
      'TOEFL iBT or GRE scores',
      'Personal statement and study objective essay'
    ],
    applicationInstructions: [
      'Applications are processed through the US Embassy or bi-national Fulbright Commission in your home country.'
    ],
    applicationUrl: 'https://example.org/fulbright-scholars-usa/apply',
    sourceUrl: 'https://example.org/fulbright-scholars-usa',
    dateAdded: '2026-07-12',
    lastVerified: 'August 10, 2026',
    featured: true
  },
  {
    id: 'sf-017',
    title: 'Swiss Government Excellence Postdoctoral Scholarship',
    slug: 'swiss-government-excellence-postdoctoral-scholarship',
    organization: 'Swiss Federal Commission for Scholarships',
    country: 'Switzerland',
    studyDestination: 'Switzerland',
    degreeLevel: 'PhD',
    fieldOfStudy: 'Engineering',
    fundingType: 'Fully Funded',
    amount: 'CHF 1,920 / month + Health Insurance',
    deadline: '2026-10-15',
    eligibleCountries: 'International (180+ Countries)',
    description: 'Enables outstanding young researchers to perform doctoral or postdoctoral research at top Swiss public universities and research institutes.',
    benefits: [
      'Monthly allowance of CHF 1,920',
      'Mandatory Swiss health insurance',
      'One-time housing allowance and transport pass'
    ],
    eligibility: [
      'Master degree or PhD achieved after Nov 2023',
      'Research proposal agreed by Swiss host professor'
    ],
    requirements: [
      'Signed research proposal',
      'Professorial endorsement letter',
      'Academic transcripts'
    ],
    applicationInstructions: [
      'Contact Swiss Embassy in origin country for official application forms.'
    ],
    applicationUrl: 'https://example.org/swiss-gov-excellence/apply',
    sourceUrl: 'https://example.org/swiss-gov-excellence',
    dateAdded: '2026-08-02',
    lastVerified: 'August 10, 2026',
    featured: false
  },
  {
    id: 'sf-018',
    title: 'Melbourne International Undergraduate Scholarship',
    slug: 'melbourne-international-undergraduate-scholarship',
    organization: 'University of Melbourne Foundation',
    country: 'Australia',
    studyDestination: 'Australia',
    degreeLevel: 'Undergraduate',
    fieldOfStudy: 'Business',
    fundingType: 'Partially Funded',
    amount: '100% or 50% Tuition Remission',
    deadline: '2026-11-01',
    eligibleCountries: 'International (Non-Australian)',
    description: 'Awarded to high-achieving international undergraduate students in recognition of their outstanding academic achievements.',
    benefits: [
      '$10,000 tuition fee waiver in first year, or up to 100% fee remission over 3 years'
    ],
    eligibility: [
      'Received unconditional offer for Melbourne Bachelor degree',
      'Top 1% high school academic results'
    ],
    requirements: [
      'Direct admissions application to University of Melbourne'
    ],
    applicationInstructions: [
      'All eligible international applicants with an offer are automatically considered.'
    ],
    applicationUrl: 'https://example.org/melbourne-undergrad/apply',
    sourceUrl: 'https://example.org/melbourne-undergrad',
    dateAdded: '2026-08-03',
    lastVerified: 'August 10, 2026',
    featured: false
  },
  {
    id: 'sf-019',
    title: 'Singapore International Graduate Award (SINGA)',
    slug: 'singapore-international-graduate-award-singa',
    organization: 'A*STAR Research Institute',
    country: 'Singapore',
    studyDestination: 'Singapore',
    degreeLevel: 'PhD',
    fieldOfStudy: 'Computer Science',
    fundingType: 'Fully Funded',
    amount: 'S$2,700/month + Full Tuition + Flights',
    deadline: '2026-12-01',
    eligibleCountries: 'International (All Countries)',
    description: 'A partnership between A*STAR, NTU, NUS, SUTD and SMU to train young international researchers in cutting-edge science and computing.',
    benefits: [
      'Full tuition fee coverage for 4 PhD years',
      'Monthly stipend of S$2,700 (increased to S$3,200 after qualifying exam)',
      'One-time airfare grant up to S$1,500',
      'One-time settling-in allowance of S$1,000'
    ],
    eligibility: [
      'Graduates with passion for research and excellent academic results',
      'Good spoken and written English skills'
    ],
    requirements: [
      'Passport copy and academic transcripts',
      '2 recommendation reports'
    ],
    applicationInstructions: [
      'Apply online through A*STAR SINGA portal.'
    ],
    applicationUrl: 'https://example.org/singa-singapore/apply',
    sourceUrl: 'https://example.org/singa-singapore',
    dateAdded: '2026-07-28',
    lastVerified: 'August 10, 2026',
    featured: true
  },
  {
    id: 'sf-020',
    title: 'Erasmus Mundus Joint Master in Artificial Intelligence',
    slug: 'erasmus-mundus-master-ai-europe',
    organization: 'European Education Initiative',
    country: 'France',
    studyDestination: 'France',
    degreeLevel: "Master's",
    fieldOfStudy: 'Computer Science',
    fundingType: 'Fully Funded',
    amount: '€1,400/month stipend + Full Tuition',
    deadline: '2026-10-30',
    eligibleCountries: 'International (All Countries)',
    description: 'Multi-country European Master degree delivered across leading universities in France, Spain, and Germany specializing in deep learning.',
    benefits: [
      'Full tuition fee exemption for 2 years',
      'Monthly subsistence allowance of €1,400 for 24 months',
      'Travel and installation budget up to €3,000/year'
    ],
    eligibility: [
      'Bachelor in CS, Data Science, Math or Robotics',
      'IELTS 6.5+ or equivalent English certification'
    ],
    requirements: [
      'Degree certificate, CV, motivation letter, 2 reference letters'
    ],
    applicationInstructions: [
      'Submit online application via EMJMD consortium website.'
    ],
    applicationUrl: 'https://example.org/erasmus-ai-master/apply',
    sourceUrl: 'https://example.org/erasmus-ai-master',
    dateAdded: '2026-08-04',
    lastVerified: 'August 10, 2026',
    featured: false
  },
  {
    id: 'sf-021',
    title: 'KAIST International Student Graduate Scholarship',
    slug: 'kaist-international-graduate-scholarship-korea',
    organization: 'KAIST Korea',
    country: 'South Korea',
    studyDestination: 'South Korea',
    degreeLevel: "Master's",
    fieldOfStudy: 'Engineering',
    fundingType: 'Fully Funded',
    amount: 'Full Tuition Waiver + 350,000 KRW/month',
    deadline: '2026-09-15',
    eligibleCountries: 'International (Non-Korean)',
    description: 'Full financial support for international scholars admitted to KAIST science and engineering degree programs.',
    benefits: [
      'Complete tuition coverage for 2 years (MS) or 4 years (PhD)',
      'Monthly living allowance',
      'National health insurance premium support'
    ],
    eligibility: [
      'Non-Korean national',
      'Bachelor or Master degree completed'
    ],
    requirements: [
      'KAIST application form, 2 recommendation letters, official transcripts'
    ],
    applicationInstructions: [
      'Complete KAIST online application and mail physical documents.'
    ],
    applicationUrl: 'https://example.org/kaist-scholarship/apply',
    sourceUrl: 'https://example.org/kaist-scholarship',
    dateAdded: '2026-07-30',
    lastVerified: 'August 10, 2026',
    featured: false
  },
  {
    id: 'sf-022',
    title: 'Gates Cambridge International Postgraduate Scholarship',
    slug: 'gates-cambridge-scholarship-uk',
    organization: 'Gates Cambridge Trust',
    country: 'United Kingdom',
    studyDestination: 'United Kingdom',
    degreeLevel: 'PhD',
    fieldOfStudy: 'Medicine',
    fundingType: 'Fully Funded',
    amount: '£20,000/year stipend + Full University Composition Fee',
    deadline: '2026-10-08',
    eligibleCountries: 'International (Non-UK)',
    description: 'One of the world’s most prestigious postgraduate awards for outstanding applicants outside the UK to pursue a degree at Cambridge.',
    benefits: [
      'Full University Composition Fee',
      'Maintenance allowance (£20,000 per year)',
      'One economy single airfare at beginning and end of course',
      'Inbound visa costs & Immigration Health Surcharge'
    ],
    eligibility: [
      'Outstanding academic record',
      'Commitment to improving the lives of others',
      'Applying for PhD or Master at University of Cambridge'
    ],
    requirements: [
      'Gates Cambridge reference and 500-word Gates statement'
    ],
    applicationInstructions: [
      'Apply via University of Cambridge postgraduate portal selecting Gates Cambridge option.'
    ],
    applicationUrl: 'https://example.org/gates-cambridge/apply',
    sourceUrl: 'https://example.org/gates-cambridge',
    dateAdded: '2026-08-05',
    lastVerified: 'August 10, 2026',
    featured: true
  },
  {
    id: 'sf-023',
    title: 'Monash University Merit International Grant',
    slug: 'monash-university-merit-international-grant',
    organization: 'Monash University Foundation',
    country: 'Australia',
    studyDestination: 'Australia',
    degreeLevel: 'Undergraduate',
    fieldOfStudy: 'Arts',
    fundingType: 'Partially Funded',
    amount: '$10,000 per annum',
    deadline: '2026-10-15',
    eligibleCountries: 'International (All Countries)',
    description: 'Encourages high-achieving international students to undertake undergraduate degrees at Monash campuses.',
    benefits: [
      '$10,000 per year paid towards tuition fees until course completion'
    ],
    eligibility: [
      'Full-time undergraduate enrollment offer',
      'Minimum 85% academic average'
    ],
    requirements: [
      'Monash admissions application and 500-word scholarship personal statement'
    ],
    applicationInstructions: [
      'Submit separate Monash scholarship form before deadline.'
    ],
    applicationUrl: 'https://example.org/monash-merit/apply',
    sourceUrl: 'https://example.org/monash-merit',
    dateAdded: '2026-08-07',
    lastVerified: 'August 10, 2026',
    featured: false
  },
  {
    id: 'sf-024',
    title: 'ETH Zurich Excellence Master’s Fellowship (ESOP)',
    slug: 'eth-zurich-excellence-master-fellowship-switzerland',
    organization: 'ETH Zurich Foundation',
    country: 'Switzerland',
    studyDestination: 'Switzerland',
    degreeLevel: "Master's",
    fieldOfStudy: 'Computer Science',
    fundingType: 'Fully Funded',
    amount: 'CHF 12,000 / semester + Full Tuition Waiver',
    deadline: '2026-11-30',
    eligibleCountries: 'International (All Countries)',
    description: 'Supports outstanding national and international students wishing to pursue a Master’s degree at ETH Zurich with full financial grant.',
    benefits: [
      'Grant covering living and study costs (CHF 12,000 per semester)',
      'Full tuition fee waiver'
    ],
    eligibility: [
      'Very good result in Bachelor (top 10% of Bachelor program)',
      'Enrolling in Master degree at ETH Zurich'
    ],
    requirements: [
      'Pre-proposal for Master’s thesis'
    ],
    applicationInstructions: [
      'Submit ESOP application during standard ETH Master admission window.'
    ],
    applicationUrl: 'https://example.org/eth-zurich-esop/apply',
    sourceUrl: 'https://example.org/eth-zurich-esop',
    dateAdded: '2026-08-08',
    lastVerified: 'August 10, 2026',
    featured: true
  },
  {
    id: 'sf-025',
    title: 'University of Tokyo ADB-Japan Scholarship',
    slug: 'university-of-tokyo-adb-japan-scholarship',
    organization: 'Asian Development Bank',
    country: 'Japan',
    studyDestination: 'Japan',
    degreeLevel: "Master's",
    fieldOfStudy: 'Social Sciences',
    fundingType: 'Fully Funded',
    amount: 'Full Tuition + Monthly Subsistence Allowance',
    deadline: '2026-12-10',
    eligibleCountries: 'ADB Borrowing Member Countries',
    description: 'Provides opportunity for well-qualified citizens of ADB developing member countries to undertake postgraduate studies in economics, management, science and technology.',
    benefits: [
      'Full tuition fees',
      'Monthly subsistence allowance',
      'Housing allowance and medical insurance',
      'Economy roundtrip airfare'
    ],
    eligibility: [
      'Citizen of ADB borrowing member country',
      'At least 2 years of full-time professional work experience'
    ],
    requirements: [
      'ADB application form, income verification, work certificates'
    ],
    applicationInstructions: [
      'Submit application through University of Tokyo GSFS office.'
    ],
    applicationUrl: 'https://example.org/utokyo-adb/apply',
    sourceUrl: 'https://example.org/utokyo-adb',
    dateAdded: '2026-08-09',
    lastVerified: 'August 10, 2026',
    featured: false
  }
];

export const POPULAR_CATEGORIES = [
  { id: 'undergraduate', label: 'Undergraduate', count: '0 Scholarships', description: "Bachelor's degree programs", degree: 'Undergraduate', icon: 'GraduationCap' },
  { id: 'postgraduate', label: 'Postgraduate', count: '0 Scholarships', description: 'Postgraduate & diploma awards', degree: 'Postgraduate', icon: 'BookOpen' },
  { id: 'masters', label: "Master's", count: '0 Scholarships', description: 'Graduate degree awards', degree: "Master's", icon: 'BookOpen' },
  { id: 'phd', label: 'PhD', count: '0 Scholarships', description: 'Doctoral research grants', degree: 'PhD', icon: 'Award' },
  { id: 'fully-funded', label: 'Fully Funded', count: '0 Scholarships', description: 'Tuition & stipend coverage', funding: 'Fully Funded', icon: 'Sparkles' },
  { id: 'cs', label: 'Computer Science', count: '0 Scholarships', description: 'Software & AI grants', field: 'Computer Science', icon: 'Code' },
  { id: 'engineering', label: 'Engineering', count: '0 Scholarships', description: 'Engineering & tech awards', field: 'Engineering', icon: 'Cpu' },
  { id: 'business', label: 'Business', count: '0 Scholarships', description: 'Management & finance', field: 'Business', icon: 'Briefcase' },
  { id: 'medicine', label: 'Medicine', count: '0 Scholarships', description: 'Healthcare & clinical research', field: 'Medicine', icon: 'Activity' },
  { id: 'arts', label: 'Arts & Humanities', count: '0 Scholarships', description: 'Design, literature & music', field: 'Arts', icon: 'Palette' },
  { id: 'social-sciences', label: 'Social Sciences', count: '0 Scholarships', description: 'Law, politics & economics', field: 'Social Sciences', icon: 'Globe' }
];
