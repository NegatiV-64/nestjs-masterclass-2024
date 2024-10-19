-- CreateTable
CREATE TABLE "Ticket" (
    "ticket_id" TEXT NOT NULL PRIMARY KEY,
    "ticketQuantity" INTEGER NOT NULL,
    "ticketPrice" INTEGER NOT NULL,
    "ticketStatus" TEXT NOT NULL,
    "ticket_created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticket_updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticketTransactionId" TEXT NOT NULL,
    "ticketEventId" TEXT NOT NULL,
    "ticketUserId" TEXT NOT NULL,
    CONSTRAINT "Ticket_ticketEventId_fkey" FOREIGN KEY ("ticketEventId") REFERENCES "Event" ("event_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_ticketUserId_fkey" FOREIGN KEY ("ticketUserId") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
