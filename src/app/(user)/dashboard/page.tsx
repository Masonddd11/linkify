import { signOut } from "@/lib/auth";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <form action={signOut}>
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </form>
      </div>
      <p>Welcome, {user.username}!</p>
    </div>
  );
}
