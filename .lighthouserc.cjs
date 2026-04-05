module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3, // Runs multiple times to get a reliable average
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage', // Uploads report to a public link for easy viewing
    },
  },
};
