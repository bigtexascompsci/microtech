import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const connectionString = process.env.SUPABASE_DATABASE_CONNECTION;

export const client = postgres(connectionString!, { prepare: false });
export const db = drizzle(client, { schema });
