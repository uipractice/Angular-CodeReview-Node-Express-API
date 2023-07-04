const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routing/index"];

swaggerAutogen(outputFile, endpointsFiles);
