const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance Data Processing & Access Control API",
      version: "1.0.0",
      description: "A professional backend API for managing financial records with Role-Based Access Control (RBAC).",
      contact: {
        name: "Developer",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Paths to files containing OpenAPI annotations
};

const specs = swaggerJsdoc(options);

module.exports = specs;
