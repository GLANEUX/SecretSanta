const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Secret Santa API",
      version: "0.1.0",
      description:
        "A secret santa api",
      contact: {
        name: "Océane",
        email: "oceane.glaneux@my-digital-school.org",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ['./docs/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;