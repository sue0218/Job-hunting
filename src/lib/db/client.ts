import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// For query purposes - limit connections for Supabase Session Pooler
const queryClient = postgres(connectionString, {
  max: 1, // Limit connections for Session Pooler
  idle_timeout: 20,
  connect_timeout: 10,
})
export const db = drizzle(queryClient, { schema })

// For migrations (use this in scripts)
export const migrationClient = postgres(connectionString, { max: 1 })
