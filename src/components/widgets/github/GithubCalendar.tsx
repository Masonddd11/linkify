"use client";

import { useQuery } from "@tanstack/react-query";
import { WIDGET_SIZE } from "@prisma/client";

interface Contribution {
  date: string;
  count: number;
  level: number;
}

interface ContributionResponse {
  total: {
    [key: string]: number;
  };
  contributions: Contribution[];
}

interface GithubCalendarProps {
  username: string;
  size: WIDGET_SIZE;
}

async function fetchContributions(username: string): Promise<ContributionResponse> {
  const response = await fetch(`/api/users/github/${username}/contributions`);
  if (!response.ok) throw new Error("Failed to fetch contributions");
  return response.json();
}

const getWeeksToShow = (size: WIDGET_SIZE) => {
  return size === WIDGET_SIZE.SMALL_SQUARE ? 12 
    : size === WIDGET_SIZE.WIDE ? 27
    : size === WIDGET_SIZE.LARGE_SQUARE ? 27
    : 12;
}

export function GithubCalendar({ username, size }: GithubCalendarProps) {
  const { data, isLoading, error } = useQuery<ContributionResponse>({
    queryKey: ["github-contributions", username],
    queryFn: () => fetchContributions(username),
  });

  if (isLoading) return <CalendarSkeleton size={size} />;
  if (error) return <div>Error loading contributions</div>;
  if (!data) return null;

  const colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
  
  const weeksToShow = getWeeksToShow(size);

  const today = new Date();
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (weeksToShow * 7 - 1));

  const weeks: Contribution[][] = [];
  let currentWeek: Contribution[] = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateString = d.toISOString().split('T')[0];
    const contribution = data.contributions.find(c => c.date === dateString) || {
      date: dateString,
      count: 0,
      level: 0
    };
    
    currentWeek.push(contribution);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  const currentYear = today.getFullYear();

  return (
    <div className="w-full h-full p-2">
      <div className="grid grid-flow-col gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-rows-7 gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: colors[day.level] }}
                title={`${day.count} contributions on ${new Date(day.date).toDateString()}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        {data.total[currentYear] || 0} contributions in {currentYear}
      </div>
    </div>
  );
}

function CalendarSkeleton({ size }: { size: WIDGET_SIZE }) {
  const weeksToShow = getWeeksToShow(size);

  return (
    <div className="w-full h-full p-2">
      <div className="grid grid-flow-col gap-1">
        {Array.from({ length: weeksToShow }).map((_, weekIndex) => (
          <div key={weekIndex} className="grid grid-rows-7 gap-1">
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              <div
                key={dayIndex}
                className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
