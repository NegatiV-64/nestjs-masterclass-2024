-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "user_email" TEXT NOT NULL,
    "user_first_name" TEXT,
    "user_last_name" TEXT,
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
