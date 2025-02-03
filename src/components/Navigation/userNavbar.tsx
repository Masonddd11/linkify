import { getCurrentSession } from "@/lib/session";
import Link from "next/link";
import { signOut } from "@/lib/auth";
import LogoComponent from "@/components/LogoComponent";
import { IoMenu } from "react-icons/io5";

export default function UserNavbar() {
  const { session, user } = getCurrentSession();

  return (
    <nav className="border-b bg-white shadow-sm">
      {/* Logo */}
      <div className="flex justify-between items-center mx-5 container">
        <div className="flex items-center gap-2 h-12">
          <IoMenu className="w-6 h-6" />
          <div className="flex items-center gap-2 h-12">
            <LogoComponent size="sm" />
            {/* Navigation */}
          </div>
        </div>
        <div></div>
      </div>
    </nav>
  );
}
