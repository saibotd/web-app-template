import "dotenv/config";
import { createServer } from "vite";
import startServer from "./src/server.js";
import db from "./src/db.js";

await db.sync();

if (process.env.ENVIRONMENT == "dev") {
  const hmrServer = await createServer();
  await hmrServer.listen();

  hmrServer.printUrls();
  hmrServer.bindCLIShortcuts({ print: true });
}

startServer();
