/*
  Warnings:

  - Made the column `ticketUserId` on table `Ticket` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_first_name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_last_name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "ticket_id" TEXT NOT NULL PRIMARY KEY,
    "ticketQuantity" INTEGER NOT NULL,
    "ticketPrice" REAL NOT NULL,
    "ticketStatus" TEXT NOT NULL DEFAULT 'pending',
    "ticketCreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticketUpdatedAt" DATETIME NOT NULL,
    "ticketTransactionId" TEXT NOT NULL,
    "ticketEventId" TEXT NOT NULL,
    "ticketUserId" TEXT NOT NULL,
    CONSTRAINT "Ticket_ticketEventId_fkey" FOREIGN KEY ("ticketEventId") REFERENCES "Event" ("event_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_ticketUserId_fkey" FOREIGN KEY ("ticketUserId") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("ticketCreatedAt", "ticketEventId", "ticketPrice", "ticketQuantity", "ticketStatus", "ticketTransactionId", "ticketUpdatedAt", "ticketUserId", "ticket_id") SELECT "ticketCreatedAt", "ticketEventId", "ticketPrice", "ticketQuantity", coalesce("ticketStatus", 'pending') AS "ticketStatus", "ticketTransactionId", "ticketUpdatedAt", "ticketUserId", "ticket_id" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE TABLE "new_User" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "user_email" TEXT NOT NULL,
    "user_first_name" TEXT NOT NULL,
    "user_last_name" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,
    "user_role" TEXT NOT NULL DEFAULT 'user',
    "user_created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("user_created_at", "user_email", "user_first_name", "user_id", "user_last_name", "user_password", "user_role", "user_updated_at") SELECT "user_created_at", "user_email", "user_first_name", "user_id", "user_last_name", "user_password", "user_role", "user_updated_at" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_user_email_key" ON "User"("user_email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
