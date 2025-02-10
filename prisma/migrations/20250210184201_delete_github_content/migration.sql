/*
  Warnings:

  - You are about to drop the `GithubContent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GithubContent" DROP CONSTRAINT "GithubContent_widgetId_fkey";

-- DropTable
DROP TABLE "GithubContent";
