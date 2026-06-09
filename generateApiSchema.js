const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finconnect SDK Reference',
      version: '1.0.0',
      description: 'Automated SDK module documentation for Mintlify',
    },
  },
  apis: [
    // 1. Scans specific root-level SDK entry point files
    path.join(__dirname, './*.js'), 
    path.join(__dirname, './*.ts'), 
    
    // 2. Scans subfolders if your SDK methods break out into other paths
    path.join(__dirname, './src/**/*.js'),
    path.join(__dirname, './src/**/*.ts')
  ], 
};
