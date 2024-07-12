CREATE TABLE IF NOT EXISTS "history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player1Id" uuid NOT NULL,
	"player1Username" varchar(255) NOT NULL,
	"player1Delta" integer NOT NULL,
	"player2Id" uuid NOT NULL,
	"player2Username" varchar(255) NOT NULL,
	"player2Delta" integer NOT NULL,
	"winner" varchar(255) NOT NULL,
	"totalTimeTaken" integer NOT NULL
);
