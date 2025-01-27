import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { user } = await getCurrentSession();

  if (user === null) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user.name}!</p>

      {/* Example of a server action using session validation */}
      <form
        action={async () => {
          "use server";
          const { user } = await getCurrentSession();
          if (user === null) {
            return redirect("/login");
          }
        }}
      >
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Perform Action
        </button>
      </form>
    </div>
  );
}
