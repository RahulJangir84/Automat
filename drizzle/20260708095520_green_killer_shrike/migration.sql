CREATE TYPE "automation_action_type" AS ENUM('create_task', 'create_calendar_event', 'send_reply', 'add_label', 'llm_decide');--> statement-breakpoint
CREATE TYPE "automation_trigger_type" AS ENUM('gmail_new_email', 'gmail_label_added', 'schedule');--> statement-breakpoint
CREATE TABLE "automations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"trigger_type" "automation_trigger_type" NOT NULL,
	"trigger_config" jsonb DEFAULT '{}' NOT NULL,
	"action_type" "automation_action_type" DEFAULT 'llm_decide'::"automation_action_type" NOT NULL,
	"action_config" jsonb DEFAULT '{}' NOT NULL,
	"llm_prompt" text,
	"last_run_at" timestamp,
	"run_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "automations" ADD CONSTRAINT "automations_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;