const {
  PORT,
  DB_PASSWORD,
  DB_USER,
  DATABASE,
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME,
  S3_BUCKET_KEY
} = process.env;
  
  module.exports = {
    env: process.env.NODE_ENV || "development",
    port: PORT,
    DB_PASSWORD: DB_PASSWORD,
    DB_USER: DB_USER,
    DATABASE: DATABASE,
    S3_REGION,
    S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY,
    S3_BUCKET_NAME,
    S3_BUCKET_KEY
  };
  