-- CreateTable
CREATE TABLE "Ticket" (
    "ticket_id" TEXT NOT NULL PRIMARY KEY,
    "ticketQuantity" INTEGER NOT NULL,
    "ticketPrice" REAL NOT NULL,
    "ticketStatus" TEXT DEFAULT 'pending',
    "ticketCreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticketUpdatedAt" DATETIME NOT NULL,
    "ticketTransactionId" TEXT NOT NULL,
    "ticketEventId" TEXT NOT NULL,
    "ticketUserId" TEXT,
    CONSTRAINT "Ticket_ticketEventId_fkey" FOREIGN KEY ("ticketEventId") REFERENCES "Event" ("event_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_ticketUserId_fkey" FOREIGN KEY ("ticketUserId") REFERENCES "User" ("user_id") ON DELETE SET NULL ON UPDATE CASCADE
);
