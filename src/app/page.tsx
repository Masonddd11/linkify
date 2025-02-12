import { Features } from "./_components/Features";
import { Footer } from "./_components/Footer";
import { getCurrentSession } from "@/lib/session";
import { ClientHero } from "./_components/ClientHero";
import { getProfileById } from "@/lib/user";

export default async function LandingPage() {
  const { session, user } = await getCurrentSession();

  const profile = await getProfileById(user?.id ?? 0);

  return (
    <div className="bg-white">
      {session && (
        <ClientHero
          session={session}
          slug={profile?.UserProfile?.slug ?? ""}
        />
      )}
      <Features />
      <Footer />
    </div>
  );
}
