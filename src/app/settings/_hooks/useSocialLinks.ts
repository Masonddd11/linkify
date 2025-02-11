import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PLATFORM } from "@prisma/client";

interface SocialLink {
  platform: PLATFORM;
  url: string;
  handle: string;
}

interface SocialLinkInput {
  links: Record<string, { url: string; handle: string }>;
}

async function fetchSocialLinks(): Promise<SocialLink[]> {
  const response = await fetch("/api/users/social-links");
  if (!response.ok) throw new Error("Failed to fetch social links");
  return response.json();
}

async function updateSocialLinks(data: SocialLinkInput) {
  const response = await fetch("/api/users/social-links", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update social links");
  return response.json();
}

export function useSocialLinks() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["social-links"],
    queryFn: fetchSocialLinks,
  });

  const { mutateAsync: updateLinks } = useMutation<void, Error, SocialLinkInput>({
    mutationFn: updateSocialLinks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
    },
  });

  return {
    data,
    isLoading,
    updateSocialLinks: updateLinks,
  };
} 