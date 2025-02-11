import { getProfileAndSocialsAndWidgetsBySlug, getUserById } from "@/lib/user";
import ProfileNotFoundComponent from "./_components/ProfileNotFoundComponent";
import { UserProfileComponent } from "./_components/UserProfileComponent";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function UserPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  if (!slug) {
    return <ProfileNotFoundComponent />;
  }

  const user = await getProfileAndSocialsAndWidgetsBySlug(slug);

  const currentUser = await getCurrentSession();

  const currentUserWithProfile = await getUserById(currentUser?.user?.id ?? 0);

  if (!user || !user.UserProfile) {
    return <ProfileNotFoundComponent />;
  }

  const isMyLink =
    user.UserProfile.slug === currentUserWithProfile?.UserProfile?.slug;

  if (!isMyLink) {
    redirect(`/${user.UserProfile.slug}`);
  }

  return <UserProfileComponent user={user} isMyLink={isMyLink} edit={false} />;
}
