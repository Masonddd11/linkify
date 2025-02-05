/*
  Warnings:

  - You are about to drop the column `content` on the `Widget` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EmbedType" AS ENUM ('YOUTUBE', 'SPOTIFY', 'OTHER');

-- DropIndex
DROP INDEX "Widget_profileId_idx";

-- AlterTable
ALTER TABLE "Widget" DROP COLUMN "content";

-- CreateTable
CREATE TABLE "TextContent" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "color" TEXT,
    "widgetId" TEXT NOT NULL,

    CONSTRAINT "TextContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkContent" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "widgetId" TEXT NOT NULL,

    CONSTRAINT "LinkContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageContent" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "widgetId" TEXT NOT NULL,

    CONSTRAINT "ImageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmbedContent" (
    "id" TEXT NOT NULL,
    "embedUrl" TEXT NOT NULL,
    "type" "EmbedType" NOT NULL,
    "widgetId" TEXT NOT NULL,

    CONSTRAINT "EmbedContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialContent" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "profileUrl" TEXT NOT NULL,
    "widgetId" TEXT NOT NULL,

    CONSTRAINT "SocialContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TextContent_widgetId_key" ON "TextContent"("widgetId");

-- CreateIndex
CREATE UNIQUE INDEX "LinkContent_widgetId_key" ON "LinkContent"("widgetId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageContent_widgetId_key" ON "ImageContent"("widgetId");

-- CreateIndex
CREATE UNIQUE INDEX "EmbedContent_widgetId_key" ON "EmbedContent"("widgetId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialContent_widgetId_key" ON "SocialContent"("widgetId");

-- AddForeignKey
ALTER TABLE "TextContent" ADD CONSTRAINT "TextContent_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkContent" ADD CONSTRAINT "LinkContent_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageContent" ADD CONSTRAINT "ImageContent_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmbedContent" ADD CONSTRAINT "EmbedContent_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialContent" ADD CONSTRAINT "SocialContent_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
