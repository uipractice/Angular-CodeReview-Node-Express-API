const { PORT, DB_PASSWORD, DB_USER, DATABASE, SEND_GRID_API_KEY, FE_HOST } =
  process.env;
  
  module.exports = {
    env: process.env.NODE_ENV || "development",
    port: PORT,
    DB_PASSWORD: DB_PASSWORD,
    DB_USER: DB_USER,
    DATABASE: DATABASE,
    SEND_GRID_API_KEY,
    FE_HOST
  };
  