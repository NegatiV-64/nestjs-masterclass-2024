-- CreateTable
CREATE TABLE "Ticket" (
    "ticket_id" TEXT NOT NULL PRIMARY KEY,
    "ticket_quantity" INTEGER NOT NULL,
    "ticket_price" REAL NOT NULL,
    "ticket_status" TEXT NOT NULL DEFAULT 'pending',
    "user_created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticket_updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticket_transaction_id" TEXT,
    "ticket_event_id" TEXT NOT NULL,
    "ticket_user_id" TEXT NOT NULL,
    CONSTRAINT "Ticket_ticket_event_id_fkey" FOREIGN KEY ("ticket_event_id") REFERENCES "Event" ("event_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_ticket_user_id_fkey" FOREIGN KEY ("ticket_user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
