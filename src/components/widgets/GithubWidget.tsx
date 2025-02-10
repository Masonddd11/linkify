"use client";

import { Widget } from "@prisma/client";
import { GitCommit } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface GithubWidgetProps {
  content: Widget;
  edit?: boolean;
}

async function getGithubUsername(userId: string) {
  const response = await fetch(`/api/users/${userId}/social-links?platform=GITHUB`);
  if (!response.ok) throw new Error("Failed to fetch GitHub link");
  const data = await response.json();
  return data.username;
}

export function GithubWidget({ content }: GithubWidgetProps) {
  const { data: githubUsername, isLoading } = useQuery({
    queryKey: ["github-username", content.profileId],
    queryFn: () => getGithubUsername(content.profileId.toString()),
  });

  if (isLoading) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center">
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  if (!githubUsername) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center">
        <span className="text-sm text-gray-500">No GitHub profile linked</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4">
      <a 
        href={`https://github.com/${githubUsername}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-2 text-gray-700">
          <GitCommit className="w-4 h-4" />
          <span className="font-medium">{githubUsername}</span>
        </div>
        <img 
          src={`https://ghchart.rshah.org/${githubUsername}`}
          alt="GitHub Contribution Graph"
          className="w-full rounded-lg"
        />
      </a>
    </div>
  );
} 