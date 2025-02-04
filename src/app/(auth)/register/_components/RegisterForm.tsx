// src/app/(auth)/register/_components/RegisterForm.tsx
"use client";

import { Label } from "@radix-ui/react-label";
import { useRegister } from "../_hooks/useRegister";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
  const { register, isPending, error, setError } = useRegister();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const formData = new FormData(event.currentTarget);
    const username = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    register({ username, email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name" className="sr-only">
          Username
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Username"
          className="w-full h-12"
          required
        />
      </div>

      <div>
        <Label htmlFor="email" className="sr-only">
          Email address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email address"
          className="w-full h-12"
          required
        />
      </div>

      <div>
        <Label htmlFor="password" className="sr-only">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          className="w-full h-12"
          required
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        className="w-full h-12 text-base bg-primary-600 hover:bg-primary-700"
        disabled={isPending}
      >
        {isPending ? "Creating account..." : "Create account"}
      </Button>

      <div className="text-sm text-center">
        <span className="text-neutral-600">Already have an account? </span>
        <Link href="/login" className="text-primary-600 hover:underline">
          Log in
        </Link>
      </div>
    </form>
  );
}
