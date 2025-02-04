import { getProfileAndSocialsAndWidgetsBySlug } from "@/lib/user";
import ProfileNotFoundComponent from "./_components/ProfileNotFoundComponent";
import { UserProfileComponent } from "./_components/UserProfileComponent";

export default async function UserPage({
  params,
}: {
  params: { slug: string };
}) {
  const user = await getProfileAndSocialsAndWidgetsBySlug(params.slug);

  if (!user) {
    return <ProfileNotFoundComponent />;
  }

  const isMyLink = user.UserProfile?.slug === params.slug;

  return <UserProfileComponent user={user} isMyLink={isMyLink} edit={false} />;
}
