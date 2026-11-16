import app from "./src/app.js";
import config from "./src/config/env.js";
import { connectDatabase, disconnectDatabase } from "./src/config/database.js";
import { initJobs } from "./src/jobs/index.js";

async function start() {
  await connectDatabase();
  await initJobs();

  const server = app.listen(config.port, () => {
    console.log(
      `[server] đang lắng nghe tại http://localhost:${config.port} (${config.env})`,
    );
  });

  const shutdown = (signal) => {
    console.log(`\n[server] nhận tín hiệu ${signal}, đang tắt server...`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((err) => {
  console.error("[server] Khởi động thất bại:", err);
  process.exit(1);
});
