import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import InfoWrapper from "./_components/InfoWrapper";
import { hasUserClaimedSlug } from "@/app/(user)/onboarding/_actions";

export default async function OnboardingPage() {
  const { session } = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const [result, error] = await hasUserClaimedSlug();

  if (error) {
    throw error;
  }

  const isClaimed = result?.isClaimed ?? false;

  return (
    <form>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <InfoWrapper step={isClaimed ? 2 : 1} />
      </div>
    </form>
  );
}
