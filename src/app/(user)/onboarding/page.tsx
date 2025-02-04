import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import InfoWrapper from "./_components/InfoWrapper";
import { hasUserClaimedSlug } from "@/app/(user)/onboarding/_actions";
import { getProfileAndSocialsById } from "@/lib/user";

export default async function OnboardingPage() {
  const { session, user } = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const hasOnboarded = user?.isOnboarded;

  const userWithProfile = await getProfileAndSocialsById(user?.id);

  if (!userWithProfile) {
    throw new Error("Failed to fetch user profile");
  }

  if (hasOnboarded) {
    redirect(`/${userWithProfile?.UserProfile?.slug}`);
  }

  const [result, error] = await hasUserClaimedSlug();

  if (error) {
    throw error;
  }

  const isClaimed = result?.isClaimed ?? false;

  return (
    <form>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <InfoWrapper step={isClaimed ? 2 : 1} user={userWithProfile} />
      </div>
    </form>
  );
}
