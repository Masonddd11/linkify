import UserNavbar from "@/components/Navigation/userNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <UserNavbar />
      {children}
    </section>
  );
}
