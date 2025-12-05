import "dotenv/config";

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "bookManagerSchema/schema.prisma",
  migrations: {
    path: "bookManagerSchema/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
    shadowDatabaseUrl: env("SHADOW_DATABASE_URL"),
  },
});
