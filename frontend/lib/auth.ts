import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { dbClient } from "./db-client";
import {
  account,
  session,
  user,
  verification,
} from "@/src/db/schema/auth-schema";

export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: drizzleAdapter(dbClient, {
    provider: "pg",
    schema: { session, user, verification, account },
  }),
  advanced: { database: { generateId: "uuid" } },
});
