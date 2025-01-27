import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useLoginQueryKey = "login";

export function useLoginWithEmailAndPw() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const { mutate: login, isPending } = useMutation({
    mutationKey: [useLoginQueryKey],
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to login");
      }

      return response.json();
    },
    onSuccess: () => {
      // Use router.replace to prevent going back to login page
      router.replace("/dashboard");
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  return {
    login,
    isPending,
    error,
    setError,
  };
}
