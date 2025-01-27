import Image from "next/image";
import LoginForm from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left Section */}
      <div className="w-full lg:w-[600px] p-8 flex flex-col">
        <div className="flex items-center gap-2 h-12 mb-16">
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
          <span className="text-2xl font-bold">Linkify</span>
        </div>

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
