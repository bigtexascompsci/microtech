ALTER TABLE "embeddings" RENAME TO "references";--> statement-breakpoint
ALTER TABLE "references" DROP CONSTRAINT "embeddings_id_documents_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "references" ADD CONSTRAINT "references_id_documents_id_fk" FOREIGN KEY ("id") REFERENCES "public"."documents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
