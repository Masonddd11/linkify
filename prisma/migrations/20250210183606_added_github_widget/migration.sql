-- AlterEnum
ALTER TYPE "WIDGET_TYPE" ADD VALUE 'GITHUB';

-- CreateTable
CREATE TABLE "GithubContent" (
    "id" TEXT NOT NULL,
    "widgetId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "lastCommitMessage" TEXT,

    CONSTRAINT "GithubContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GithubContent_widgetId_key" ON "GithubContent"("widgetId");

-- AddForeignKey
ALTER TABLE "GithubContent" ADD CONSTRAINT "GithubContent_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
