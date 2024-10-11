-- CreateTable
CREATE TABLE "Event" (
    "event_id" TEXT NOT NULL PRIMARY KEY,
    "event_name" TEXT NOT NULL,
    "event_description" TEXT NOT NULL,
    "event_location" TEXT NOT NULL,
    "event_date" DATETIME NOT NULL,
    "event_created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
