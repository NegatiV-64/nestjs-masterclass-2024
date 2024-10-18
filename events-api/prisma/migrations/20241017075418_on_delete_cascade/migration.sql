-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "ticket_id" TEXT NOT NULL PRIMARY KEY,
    "ticket_quantity" INTEGER NOT NULL,
    "ticket_price" REAL NOT NULL,
    "ticket_status" TEXT NOT NULL DEFAULT 'pending',
    "ticket_created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticket_updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticket_transaction_id" TEXT,
    "ticket_event_id" TEXT NOT NULL,
    "ticket_user_id" TEXT NOT NULL,
    CONSTRAINT "Ticket_ticket_event_id_fkey" FOREIGN KEY ("ticket_event_id") REFERENCES "Event" ("event_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Ticket_ticket_user_id_fkey" FOREIGN KEY ("ticket_user_id") REFERENCES "User" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("ticket_created_at", "ticket_event_id", "ticket_id", "ticket_price", "ticket_quantity", "ticket_status", "ticket_transaction_id", "ticket_updated_at", "ticket_user_id") SELECT "ticket_created_at", "ticket_event_id", "ticket_id", "ticket_price", "ticket_quantity", "ticket_status", "ticket_transaction_id", "ticket_updated_at", "ticket_user_id" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
