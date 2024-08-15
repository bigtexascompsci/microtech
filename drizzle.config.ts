import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema/*.ts",
  out: "./db/_out/",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.SUPABASE_DATABASE_CONNECTION!,
  },
});
