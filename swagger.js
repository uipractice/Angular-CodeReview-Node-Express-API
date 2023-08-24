const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routing/index"];

swaggerAutogen(outputFile, endpointsFiles);
