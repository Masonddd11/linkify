import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { isValidUsername } from "@/lib/user";

const registerQueryKey = "register";

interface RegisterInput {
  email: string;
  password: string;
  username: string;
}

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

export function useRegister() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { mutate: register, isPending } = useMutation({
    mutationKey: [registerQueryKey],
    mutationFn: async (data: RegisterInput) => {
      const validated = registerSchema.parse(data);

      if (!isValidUsername(validated.username)) {
        throw new Error(
          "Username must be alphanumeric and can only contain underscores."
        );
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validated),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }

      return response.json();
    },
    onSuccess: () => {
      router.push("/onboarding");
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  return {
    register,
    setError,
    error,
    isPending,
  };
}
