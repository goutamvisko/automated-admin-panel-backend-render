import "dotenv/config";

const NODE_ENV = process.env.NODE_ENV || "development";

const Envconfig = {
  development: {
    PORT: process.env.PORT || 8000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/test_db",
    JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || "1h",
    EMAIL_USER: process.env.EMAIL_USER || "test@example.com",
    EMAIL_PASS: process.env.EMAIL_PASS || "password",

    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    AWS_REGION: process.env.AWS_REGION || "",
    AWS_BUCKET: process.env.AWS_BUCKET || "",
  },

  production: {
    PORT: process.env.PORT || 8000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,

    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_BUCKET: process.env.AWS_BUCKET,
  },
};

export default Envconfig[NODE_ENV];
