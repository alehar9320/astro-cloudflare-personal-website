export const PERSON_SCHEMA = {
  '@type': 'Person',
  '@id': 'https://harenstam.com/#person',
  name: 'Alexander Härenstam',
  jobTitle: 'Strategic Product Leader',
  description:
    'Strategic Product Leader specializing in Developer Experience (DevEx) and Industrial AI at IFS.',
  url: 'https://harenstam.com/',
  sameAs: [
    'https://www.linkedin.com/in/alehar/',
    'https://github.com/alehar9320/',
    'https://blog.ifs.com/author/alexander-harenstam/',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'IFS',
    url: 'https://www.ifs.com/',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Chalmers University of Technology',
    url: 'https://www.chalmers.se/en/',
  },
};
