import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	dialect: 'postgresql',
	out: './db/neon/migrations',
	schema: './db/neon/schema.ts', // ✅ single schema file
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
})
