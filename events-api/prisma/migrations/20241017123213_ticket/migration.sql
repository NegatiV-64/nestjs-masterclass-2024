-- CreateTable
CREATE TABLE "Ticket" (
    "ticket_id" TEXT NOT NULL PRIMARY KEY,
    "ticket_quantity" INTEGER NOT NULL,
    "ticket_price" REAL NOT NULL,
    "ticket_status" TEXT NOT NULL,
    "ticket_created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticket_updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticket_transaction_id" TEXT,
    "event_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "Ticket_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event" ("event_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Ticket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);
