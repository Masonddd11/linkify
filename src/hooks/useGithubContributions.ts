import { useQuery } from "@tanstack/react-query";
import { ContributionResponse } from "@/components/widgets/GithubWidget";

async function fetchContributions(profileId: number): Promise<ContributionResponse> {
  const response = await fetch(`/api/users/github/${profileId}/contributions`);
  if (!response.ok) throw new Error("Failed to fetch contributions");
  return response.json();
}

export function useGithubContributions(profileId: number) {
  return useQuery<ContributionResponse>({
    queryKey: ["github-contributions", profileId],
    queryFn: () => fetchContributions(profileId),
  });
} 