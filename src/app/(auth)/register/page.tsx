import Image from "next/image";
import RegisterForm from "./_components/RegisterForm";
import LogoComponent from "@/components/LogoComponent";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const { session } = await getCurrentSession();

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen w-full flex">
      {/* Left Section */}
      <div className="hidden lg:flex lg:flex-1 bg-primary-600 relative">
        <Image
          src="/login-banner.png"
          alt="Auth Banner"
          fill
          className="object-cover z-10"
        />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col p-8">
        <LogoComponent />
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <h1 className="text-4xl font-bold mb-2">Create an account</h1>
          <p className="text-neutral-600 mb-8">Sign up to get started</p>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
