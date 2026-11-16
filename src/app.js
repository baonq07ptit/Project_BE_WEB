import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import config from "./config/env.js";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middlewares/error.js";

const app = express();

// Sau reverse proxy (nginx/PaaS): tin N hop để req.ip là IP client thật, tránh
// rate-limit gộp tất cả vào 1 bucket theo IP proxy. 0 = tắt (chạy trực tiếp).
if (config.trustProxy) app.set("trust proxy", config.trustProxy);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.corsOrigins.includes(origin))
        return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (!config.isProd) app.use(morgan("dev"));

app.use("/api/v1", routes);

// Middleware xử lý lỗi phải đăng ký cuối cùng.
app.use(notFound);
app.use(errorHandler);

export default app;
