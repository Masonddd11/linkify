import { getProfileAndSocialsBySlug } from "@/lib/user";
import ProfileNotFoundComponent from "./_components/ProfileNotFoundComponent";
import { UserProfileComponent } from "./_components/UserProfileComponent";

export default async function UserPage({
  params,
}: {
  params: { slug: string };
}) {
  const user = await getProfileAndSocialsBySlug(params.slug);

  if (!user) {
    return <ProfileNotFoundComponent />;
  }

  return <UserProfileComponent user={user} />;
}
