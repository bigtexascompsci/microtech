ALTER TABLE "chats" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;