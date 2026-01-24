import postgres from 'postgres'

const sql = postgres(process.env.DATABASE_URL)

const query = `
-- Create new tables for beta campaign system
CREATE TABLE IF NOT EXISTS "beta_campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"max_slots" integer NOT NULL,
	"claimed_slots" integer DEFAULT 0 NOT NULL,
	"starts_at" timestamp,
	"ends_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "beta_campaigns_key_unique" UNIQUE("key")
);

CREATE TABLE IF NOT EXISTS "user_entitlements" (
	"clerk_id" text PRIMARY KEY NOT NULL,
	"trial_ends_at" timestamp,
	"trial_source" text,
	"invite_code" text NOT NULL,
	"invited_by_code" text,
	"survey_completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_entitlements_invite_code_unique" UNIQUE("invite_code")
);

CREATE TABLE IF NOT EXISTS "rewards_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" text NOT NULL,
	"reward_type" text NOT NULL,
	"source_id" text NOT NULL,
	"days" integer NOT NULL,
	"granted_at" timestamp DEFAULT now() NOT NULL,
	"notes" text
);

CREATE TABLE IF NOT EXISTS "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inviter_clerk_id" text NOT NULL,
	"invite_code" text NOT NULL,
	"referred_clerk_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"qualified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "referrals_referred_clerk_id_unique" UNIQUE("referred_clerk_id")
);

CREATE TABLE IF NOT EXISTS "feedback_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" text NOT NULL,
	"nps" integer,
	"satisfaction" integer,
	"best_feature" text,
	"good_text" text,
	"improve_text" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
`

try {
  await sql.unsafe(query)
  console.log('Tables created successfully')

  // Create indices separately
  await sql.unsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "rewards_ledger_unique_idx" ON "rewards_ledger" USING btree ("clerk_id","reward_type","source_id")`)
  await sql.unsafe(`CREATE INDEX IF NOT EXISTS "rewards_ledger_clerk_id_idx" ON "rewards_ledger" USING btree ("clerk_id")`)
  await sql.unsafe(`CREATE INDEX IF NOT EXISTS "referrals_inviter_idx" ON "referrals" USING btree ("inviter_clerk_id")`)
  await sql.unsafe(`CREATE INDEX IF NOT EXISTS "referrals_invite_code_idx" ON "referrals" USING btree ("invite_code")`)

  console.log('Indices created successfully')

  // Insert initial beta campaign
  await sql`
    INSERT INTO beta_campaigns (key, max_slots, enabled)
    VALUES ('beta_standard_300_30d', 300, true)
    ON CONFLICT (key) DO NOTHING
  `
  console.log('Initial beta campaign created')

  await sql.end()
  console.log('Migration completed!')
  process.exit(0)
} catch (error) {
  console.error('Migration failed:', error)
  await sql.end()
  process.exit(1)
}
