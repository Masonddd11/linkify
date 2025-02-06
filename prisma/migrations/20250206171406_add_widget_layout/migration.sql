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

-- CreateIndex
CREATE UNIQUE INDEX "WidgetLayout_widgetId_key" ON "WidgetLayout"("widgetId");

-- AddForeignKey
ALTER TABLE "WidgetLayout" ADD CONSTRAINT "WidgetLayout_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
