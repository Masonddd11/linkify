import { redirect } from "next/navigation";
import { UserProfileComponent } from "../_components/UserProfileComponent";
import { getProfileAndSocialsAndWidgetsBySlug, getUserById } from "@/lib/user";
import ProfileNotFoundComponent from "../_components/ProfileNotFoundComponent";
import { getCurrentSession } from "@/lib/session";

export default async function EditProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  if (!slug) {
    return redirect("/");
  }

  const user = await getProfileAndSocialsAndWidgetsBySlug(slug);

  const currentUser = await getCurrentSession();

  const currentUserWithProfile = await getUserById(currentUser?.user?.id ?? 0);

  if (!user || !user.UserProfile) {
    return <ProfileNotFoundComponent />;
  }

  const isMyLink =
    user?.UserProfile?.slug === currentUserWithProfile?.UserProfile?.slug;

  return <UserProfileComponent user={user} isMyLink={isMyLink} edit={true} />;
}
