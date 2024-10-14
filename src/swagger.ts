// src/swagger.ts
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specify the version of OpenAPI
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Documentation for your project',
    },
    servers: [
      {
        url: 'http://localhost:5000', // Your server URL
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Optional, but indicates the format of the token
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to your API docs (adjust as needed)
};

// Generate Swagger Docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Setup Swagger UI
export const setupSwagger = (app: express.Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
