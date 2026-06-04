import http from "http";
import app from "./app";
import { env } from "./configs/env";

import { startImageUploadWorker } from "./workers/imageUpload.worker";

const server = http.createServer(app);

// Khởi động worker
startImageUploadWorker();

server.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

server.on("error", (error) => {
  console.error("Error starting server:", error);
});
