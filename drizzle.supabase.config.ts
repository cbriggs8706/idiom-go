import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	dialect: 'postgresql',
	schema: './db/supabase/schema', // output file
	out: './db/supabase/migrations',
	dbCredentials: {
		url: process.env.SUPABASE_DB_URL!,
	},
})
