ALTER TABLE "notes" ADD COLUMN "is_deleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "notes" DROP COLUMN "is_active";