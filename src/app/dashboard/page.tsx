import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { invalidateSession, deleteSessionTokenCookie } from "@/lib/session";

export default async function DashboardPage() {
  const { user } = await getCurrentSession();

  if (user === null) {
    redirect("/login");
  }

  async function signOut() {
    "use server";

    const { session } = await getCurrentSession();
    if (session) {
      await invalidateSession(session.id);
    }
    await deleteSessionTokenCookie();
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <form action={signOut}>
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>
      <p>Welcome, {user.name}!</p>
    </div>
  );
}
