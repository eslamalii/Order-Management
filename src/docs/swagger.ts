import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Order Management API',
    version: '1.0.0',
    description: 'API documentation for the Order Management System',
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
}

const options = {
  definition: swaggerDefinition,
  apis: ['./src/docs/*.ts', './src/routes/*.ts', './src/docs/models/*.yaml'], // Include YAML files
}

export const swaggerSpec = swaggerJSDoc(options)
