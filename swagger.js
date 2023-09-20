const swaggerAutogen = require("swagger-autogen")({
  openapi: "3.0.0",
  specs: {
    info: {
      version: "1.0.0",
      title: "SnapNurse API Documentation",
      description: "",
    },
    components: {
      securitySchemes: {
        bearer: {
          type: "apiKey",
          name: "authorization",
          in: "header",
        },
      },
    },
    security: [
      {
        bearer: [],
      },
    ],
  },
});

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routing/index"];

swaggerAutogen(outputFile, endpointsFiles);
