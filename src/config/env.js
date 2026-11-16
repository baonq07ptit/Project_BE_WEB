import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

// Kiểm tra env một lần khi khởi động; dừng ngay nếu thiếu hoặc sai.
const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(5000),
  // Số proxy hop tin cậy để rate-limit lấy đúng IP client (X-Forwarded-For).
  // 0 = tắt (chạy trực tiếp, không proxy). Sau 1 reverse proxy/PaaS: đặt 1.
  TRUST_PROXY: Joi.number().min(0).default(0),
  CLIENT_URL: Joi.string().uri().default("http://localhost:3000"),
  // Origin thêm cho CORS, cách nhau bởi dấu phẩy (preview, IP local, domain phụ)
  CORS_ORIGINS: Joi.string().allow("").default(""),
  BACKEND_URL: Joi.string().uri().allow("").default(""),

  MONGODB_URI: Joi.string().required(),

  JWT_SECRET: Joi.string().default(
    process.env.JWT_SECRET ||
      process.env.JWT_ACCESS_SECRET ||
      "default_jwt_secret",
  ),
  JWT_EXPIRES_IN: Joi.string().default("7d"),
})
  .unknown()
  .required();

const { value: envVars, error } = schema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  throw new Error(`Lỗi kiểm tra cấu hình: ${error.message}`);
}

const backendUrl = (
  envVars.BACKEND_URL || `http://localhost:${envVars.PORT}`
).replace(/\/+$/, "");

function buildCorsOrigins(clientUrl, isProd, extraCsv) {
  const urls = new Set();
  const add = (value) => {
    if (value) urls.add(String(value).replace(/\/+$/, ""));
  };
  add(clientUrl);
  for (const part of String(extraCsv || "").split(",")) add(part.trim());
  if (!isProd) {
    for (const host of ["localhost", "127.0.0.1"]) {
      for (const port of [5173, 4173, 6666, 3000, envVars.PORT]) {
        add(`http://${host}:${port}`);
      }
    }
  }
  return [...urls];
}

const config = {
  env: envVars.NODE_ENV,
  isProd: envVars.NODE_ENV === "production",
  port: envVars.PORT,
  trustProxy: envVars.TRUST_PROXY,
  clientUrl: envVars.CLIENT_URL,
  corsOrigins: buildCorsOrigins(
    envVars.CLIENT_URL,
    envVars.NODE_ENV === "production",
    envVars.CORS_ORIGINS,
  ),
  backendUrl,

  mongoUri: envVars.MONGODB_URI,

  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
};

export default config;
