"use client";

import { Label } from "@radix-ui/react-label";
import { useVerifyEmail } from "../_hooks/useVerifyEmail";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLoginWithEmailAndPw } from "../_hooks/useLoginWithEmailAndPw";
import { AppleOriginal, GoogleOriginal } from "devicons-react";
import { MdOutlinePhonelinkRing } from "react-icons/md";

export default function LoginForm() {
  const {
    verifyEmail,
    isPending,
    error,
    setError,
    isEmailVerified,
    verifiedEmail,
  } = useVerifyEmail();

  const {
    login,
    isPending: isLoginPending,
    error: loginError,
    setError: setLoginError,
  } = useLoginWithEmailAndPw();
  const [email, setEmail] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isEmailVerified) {
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      verifyEmail(email);

      if (!error) {
        setEmail(email);
      }
    } else {
      const formData = new FormData(event.currentTarget);
      formData.append("email", email);
      const password = formData.get("password") as string;
      login({ email, password });

      if (!loginError) {
        setLoginError("");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email" className="sr-only">
          Email or username
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email or username"
          className="w-full h-12"
          required
          disabled={isEmailVerified}
          defaultValue={verifiedEmail}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>

      {isEmailVerified && (
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
      )}

      <Button
        type="submit"
        className="w-full h-12 text-base bg-primary-600 hover:bg-primary-700"
        disabled={isPending || isLoginPending}
      >
        {isPending ? "Verifying..." : isEmailVerified ? "Log in" : "Continue"}
      </Button>

      {!isEmailVerified && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-neutral-500">or</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-base font-normal justify-start px-4 space-x-3"
              onClick={() => (window.location.href = "/login/google")}
            >
              <GoogleOriginal className="h-5 w-5" />
              <span>Continue with Google</span>
            </Button>

            {/* <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-base font-normal justify-start px-4 space-x-3"
            >
              <AppleOriginal className="h-5 w-5" />
              <span>Continue with Apple</span>
            </Button> */}

            {/* <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-base font-normal justify-start px-4 space-x-3"
            >
              <MdOutlinePhonelinkRing className="h-5 w-5" />
              <span>Continue with phone number</span>
            </Button> */}
          </div>
        </>
      )}

      <div className="space-y-4 text-sm text-center">
        <div className="space-x-1">
          <Link href="#" className="text-primary-600 hover:underline">
            Forgot password?
          </Link>
          <span>•</span>
          <Link href="#" className="text-primary-600 hover:underline">
            Forgot username?
          </Link>
        </div>

        <div className="text-neutral-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary-600 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </form>
  );
}
