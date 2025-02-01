"use client";

import Spinner from "@/app/(auth)/register/_components/Spinner";
import { ClaimYourRouteComponent } from "./ClaimYourRouteComponent";
import { useState } from "react";

export default function InfoWrapper({ step }: { step: number }) {
  const [onboardStep, setOnboardStep] = useState(step);
  return (
    <>
      {onboardStep === 1 && (
        <ClaimYourRouteComponent setOnBoardStep={setOnboardStep} />
      )}
      {onboardStep === 2 && <Spinner />}
    </>
  );
}
