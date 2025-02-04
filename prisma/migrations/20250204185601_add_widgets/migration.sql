/*
  Warnings:

  - Added the required column `updatedAt` to the `SocialLink` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `platform` on the `SocialLink` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PLATFORM" AS ENUM ('INSTAGRAM', 'TWITTER', 'TIKTOK', 'YOUTUBE', 'LINKEDIN', 'GITHUB', 'FACEBOOK', 'TWITCH', 'REDDIT', 'SOUNDCLOUD', 'SPOTIFY', 'VK', 'DRIBBBLE');

-- CreateEnum
CREATE TYPE "WIDGET_TYPE" AS ENUM ('TEXT', 'LINK', 'IMAGE', 'EMBED', 'SOCIAL');

-- CreateEnum
CREATE TYPE "WIDGET_SIZE" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'WIDE', 'EXTRA_LARGE');

-- AlterTable
ALTER TABLE "SocialLink" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "platform",
ADD COLUMN     "platform" "PLATFORM" NOT NULL;

-- CreateTable
CREATE TABLE "Widget" (
    "id" TEXT NOT NULL,
    "type" "WIDGET_TYPE" NOT NULL,
    "size" "WIDGET_SIZE" NOT NULL,
    "position" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "profileId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Widget_profileId_idx" ON "Widget"("profileId");

-- CreateIndex
CREATE INDEX "SocialLink_profileId_idx" ON "SocialLink"("profileId");

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
