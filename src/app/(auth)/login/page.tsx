import Image from "next/image";
import LoginForm from "./_components/LoginForm";
import LogoComponent from "@/components/LogoComponent";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const { session } = await getCurrentSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Section */}
      <div className="w-full lg:w-[600px] p-8 flex flex-col">
        <LogoComponent />

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
          <p className="text-neutral-600 mb-8">Log in to your account</p>
          <LoginForm />
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:block relative flex-1 bg-primary-600">
        <div className="absolute inset-0 bg-[#85e600] clip-path-custom"></div>
        <Image
          src="/login-banner.png"
          alt="Decorative image"
          fill
          className="absolute bottom-0 left-0 w-full h-2/3 object-cover"
        />
      </div>
    </div>
  );
}
