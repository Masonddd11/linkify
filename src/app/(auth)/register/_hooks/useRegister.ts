import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const registerQueryKey = "register";

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type RegisterInput = z.infer<typeof registerSchema>;

export function useRegister() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const { mutate: register, isPending } = useMutation({
    mutationKey: [registerQueryKey],
    mutationFn: async (data: RegisterInput) => {
      const validated = registerSchema.parse(data);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validated),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to register");
      }

      return response.json();
    },
    onSuccess: () => {
      router.replace("/introduction");
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  return {
    register,
    isPending,
    error,
    setError,
  };
}
