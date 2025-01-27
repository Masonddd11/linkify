import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";

const useVerifyEmailQueryKey = "verify-email";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type VerifyEmailInput = z.infer<typeof emailSchema>;

export function useVerifyEmail() {
  const [error, setError] = useState<string>("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string>("");

  const { mutate: verifyEmail, isPending } = useMutation({
    mutationKey: [useVerifyEmailQueryKey],
    mutationFn: async (data: VerifyEmailInput) => {
      const validated = emailSchema.parse(data);

      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validated),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to verify email");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      if (data.isEmailExist) {
        setIsEmailVerified(true);
        setVerifiedEmail(variables.email);
      } else {
        setError("No account found with this email");
      }
    },
    onError: (error: Error) => {
      setError(error.message);
      setIsEmailVerified(false);
    },
  });

  return {
    verifyEmail: (email: string) => verifyEmail({ email }),
    isPending,
    error,
    setError,
    isEmailVerified,
    verifiedEmail,
  };
}
