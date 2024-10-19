-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "ticket_id" TEXT NOT NULL PRIMARY KEY,
    "ticketQuantity" INTEGER NOT NULL,
    "ticketPrice" INTEGER NOT NULL,
    "ticketStatus" TEXT NOT NULL,
    "ticket_created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticket_updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticketTransactionId" TEXT,
    "ticketEventId" TEXT NOT NULL,
    "ticketUserId" TEXT NOT NULL,
    CONSTRAINT "Ticket_ticketUserId_fkey" FOREIGN KEY ("ticketUserId") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_ticketEventId_fkey" FOREIGN KEY ("ticketEventId") REFERENCES "Event" ("event_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("ticketEventId", "ticketPrice", "ticketQuantity", "ticketStatus", "ticketTransactionId", "ticketUserId", "ticket_created_at", "ticket_id", "ticket_updated_at") SELECT "ticketEventId", "ticketPrice", "ticketQuantity", "ticketStatus", "ticketTransactionId", "ticketUserId", "ticket_created_at", "ticket_id", "ticket_updated_at" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
