"use client"

import { WIDGET_SIZE } from "@prisma/client"
import { Contribution, ContributionResponse } from "../GithubWidget"

interface GithubCalendarProps {
  size: WIDGET_SIZE
  isLoading: boolean
  data: ContributionResponse | null
}

const sizeConfig: Record<WIDGET_SIZE, { columns: number; rows: number }> = {
  [WIDGET_SIZE.SMALL_SQUARE]: { columns: 12, rows: 7 },
  [WIDGET_SIZE.WIDE]: { columns: 27, rows: 7 },
  [WIDGET_SIZE.LARGE_SQUARE]: { columns: 27, rows: 24 },
  [WIDGET_SIZE.LONG]: { columns: 12, rows: 24 },
}

export function GithubCalendar({ size, isLoading, data }: GithubCalendarProps) {


  if (isLoading) return <CalendarSkeleton size={size} />

  const colors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]
  const { columns, rows } = sizeConfig[size] || sizeConfig[WIDGET_SIZE.SMALL_SQUARE]

  const today = new Date()
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - (columns * rows - 1))

  const contributionDays: Contribution[] = []

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateString = d.toISOString().split("T")[0]
    const contribution = data?.contributions.find((c) => c.date === dateString) || {
      date: dateString,
      count: 0,
      level: 0,
    }
    contributionDays.push(contribution)
  }

  const currentYear = today.getFullYear()

  return (
    <div className="w-full h-full p-2">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridAutoRows: `minmax(0, 1fr)`,
          aspectRatio: `${columns} / ${rows}`,
        }}
      >
        {contributionDays.map((day) => (
          <div
            key={day.date}
            className="w-full h-full rounded-sm"
            style={{ backgroundColor: colors[day.level] }}
            title={`${day.count} contributions on ${new Date(day.date).toDateString()}`}
          />
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        {data?.total[currentYear] || 0} contributions in {currentYear}
      </div>
    </div>
  )
}

function CalendarSkeleton({ size }: { size: WIDGET_SIZE }) {
  const { columns, rows } = sizeConfig[size] || sizeConfig[WIDGET_SIZE.SMALL_SQUARE]

  return (
    <div className="w-full h-full p-2">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridAutoRows: `minmax(0, 1fr)`,
          aspectRatio: `${columns} / ${rows}`,
        }}
      >
        {Array.from({ length: columns * rows }).map((_, index) => (
          <div key={index} className="w-full h-full rounded-sm bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-500 bg-gray-200 rounded-full w-24 h-4 animate-pulse">
      </div>
    </div>
  )
}

