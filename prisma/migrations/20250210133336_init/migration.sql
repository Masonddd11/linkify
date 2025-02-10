-- CreateEnum
CREATE TYPE "PLATFORM" AS ENUM ('INSTAGRAM', 'TWITTER', 'TIKTOK', 'YOUTUBE', 'LINKEDIN', 'GITHUB', 'FACEBOOK', 'TWITCH', 'REDDIT', 'SOUNDCLOUD', 'SPOTIFY', 'VK', 'DRIBBBLE');

-- CreateEnum
CREATE TYPE "WIDGET_TYPE" AS ENUM ('TEXT', 'LINK', 'IMAGE', 'EMBED', 'SOCIAL', 'LIST', 'VIDEO');

-- CreateEnum
CREATE TYPE "WIDGET_SIZE" AS ENUM ('SMALL_SQUARE', 'LARGE_SQUARE', 'WIDE', 'LONG');

-- CreateEnum
CREATE TYPE "EmbedType" AS ENUM ('YOUTUBE', 'SPOTIFY', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "username" TEXT NOT NULL,
    "googleId" TEXT,
    "image" TEXT,
    "isOnboarded" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "slug" TEXT,
    "displayName" TEXT,
    "bio" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL,
    "platform" "PLATFORM" NOT NULL,
    "handle" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Widget" (
    "id" TEXT NOT NULL,
    "type" "WIDGET_TYPE" NOT NULL,
    "size" "WIDGET_SIZE" NOT NULL,
    "position" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "WidgetLayout" (
    "id" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "w" INTEGER NOT NULL,
    "h" INTEGER NOT NULL,
    "widgetId" TEXT NOT NULL,

    CONSTRAINT "WidgetLayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListContent" (
    "id" TEXT NOT NULL,
    "items" TEXT[],
    "widgetId" TEXT NOT NULL,

    CONSTRAINT "ListContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoContent" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "title" TEXT,
    "widgetId" TEXT NOT NULL,

    CONSTRAINT "VideoContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_slug_key" ON "UserProfile"("slug");

-- CreateIndex
CREATE INDEX "SocialLink_profileId_idx" ON "SocialLink"("profileId");

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

-- CreateIndex
CREATE UNIQUE INDEX "WidgetLayout_widgetId_key" ON "WidgetLayout"("widgetId");

-- CreateIndex
CREATE UNIQUE INDEX "ListContent_widgetId_key" ON "ListContent"("widgetId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoContent_widgetId_key" ON "VideoContent"("widgetId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "WidgetLayout" ADD CONSTRAINT "WidgetLayout_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListContent" ADD CONSTRAINT "ListContent_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoContent" ADD CONSTRAINT "VideoContent_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
