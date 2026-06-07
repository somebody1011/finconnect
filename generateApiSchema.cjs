
const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finconnect API',
      version: '1.0.0',
      description: 'Automated API documentation for Mintlify',
    },
  },
  // Scans all JavaScript/TypeScript files inside your src folder for documentation comments
  apis: ['./src/**/*.js', './src/**/*.ts'], 
};

const openapiSpecification = swaggerJSDoc(options);

// Writes the file straight to your root folder so the GitHub Action can find it
fs.writeFileSync('./openapi.json', JSON.stringify(openapiSpecification, null, 2));
console.log('✅ openapi.json generated successfully!');
