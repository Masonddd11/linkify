import Image from "next/image";

interface LogoComponentProps {
  size?: "sm" | "lg";
}

export default function LogoComponent({ size = "sm" }: LogoComponentProps) {
  return (
    <div className="flex items-center gap-2 justify-center ">
      <Image
        src="/logo.png"
        alt="Logo"
        width={size === "sm" ? 32 : 64}
        height={size === "sm" ? 32 : 64}
      />
      <span
        className={`text-${size === "sm" ? "2xl" : "3xl"} font-semibold mt-1`}
      >
        Linkify
      </span>
    </div>
  );
}
