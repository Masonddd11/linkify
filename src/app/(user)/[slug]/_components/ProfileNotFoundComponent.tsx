import { getCurrentSession } from "@/lib/session";
import { getUserById } from "@/lib/user";
import Image from "next/image";
import Link from "next/link";

export default async function ProfileNotFoundComponent() {
  const { user } = await getCurrentSession();

  const userWithProfile = await getUserById(user?.id ?? 0);

  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="flex w-full flex-col items-center justify-center gap-12 rounded-3xl bg-white/80 p-8  md:flex-row md:gap-16 md:p-12">
        <div className="relative h-80 w-80 overflow-hidden">
          <Image
            src="/profile-notfound.png"
            alt="Profile not found illustration"
            fill
            className="object-contain drop-shadow-lg transition-transform duration-300"
            priority
          />
        </div>
        <div className="flex flex-col items-center md:items-start space-y-6 text-center md:text-left">
          <h1 className="text-5xl font-bold text-gray-900">Oops!</h1>
          <p className="text-2xl text-gray-600">
            We couldn&apos;t find that page.
          </p>
          <p className="text-lg text-gray-500">
            Maybe you can find what you need here?
          </p>
          <div className="flex items-center justify-center relative">
            <div className="flex gap-3 flex-wrap md:flex-nowrap justify-center items-center">
              <Link
                href={`/${userWithProfile?.UserProfile?.slug}`}
                className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition-colors"
              >
                𝍌 Your page
              </Link>
              <Link
                href="/"
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                🏠 Homepage
              </Link>
              {/* <Link
                href="/reports"
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
              >
                Reports
              </Link> */}
            </div>
            <Image
              src="/ill-arrow.svg"
              alt="Profile not found illustration"
              width={80}
              height={80}
              className="object-contain drop-shadow-lg transition-transform duration-300 -rotate-[125deg] ml-4 hidden md:block"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
