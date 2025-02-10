"use client";

import { Widget } from "@prisma/client";
import { GitCommit} from "lucide-react";
import { GithubCalendar } from "./github/GithubCalendar";
import { useGithubContributions } from "@/hooks/useGithubContributions";

interface GithubWidgetProps {
  content: Widget;
  edit?: boolean;
}

export interface ContributionResponse {
  username: string;
  total: {
    [key: string]: number
  }
  contributions: Contribution[]
}

export interface Contribution {
  date: string
  count: number
  level: number
}

export function GithubWidget({ content }: GithubWidgetProps) {
  const { data, isLoading } = useGithubContributions(content.profileId);

  if (!data?.username && !isLoading) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center">
        <span className="text-sm text-gray-500">No GitHub profile linked</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4">
      <a
        href={`https://github.com/${data?.username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-2"
      >
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-700">
            <GitCommit className="w-4 h-4" />
            <span className="bg-gray-200 rounded-full w-24 h-4 animate-pulse"></span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-700">
            <GitCommit className="w-4 h-4" />
            <span className="font-medium">{data?.username}</span>
          </div>
        )}
      </a>
      <GithubCalendar data={data || null} size={content.size} isLoading={isLoading} />
    </div>
  );
} 