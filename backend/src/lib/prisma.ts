import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const rawConnectionString = process.env.DATABASE_URL;
if (!rawConnectionString) {
  throw new Error("DATABASE_URL is required to initialize PrismaClient");
}

const connectionUrl = new URL(rawConnectionString);
const isProduction = process.env.NODE_ENV === "production";
const currentSslMode = connectionUrl.searchParams.get("sslmode")?.toLowerCase();
const useSsl = currentSslMode !== "disable";
const allowInsecureTls =
  currentSslMode === "no-verify" ||
  process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "false" ||
  !isProduction;

if (useSsl && allowInsecureTls && currentSslMode !== "no-verify") {
  connectionUrl.searchParams.set("sslmode", "no-verify");
}

const connectionString = connectionUrl.toString();

// Local Supabase/Postgres setups can fail certificate verification on dev machines.
// Keep production strict by default and only relax verification outside production
// (or when explicitly requested via DATABASE_SSL_REJECT_UNAUTHORIZED=false).
const pool = new Pool({
  connectionString,
  ...(useSsl ? { ssl: { rejectUnauthorized: !allowInsecureTls } } : {}),
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;
