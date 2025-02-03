"use client";

import { ClaimYourRouteComponent } from "./ClaimYourRouteComponent";
import { useState } from "react";
import { AddSocialLinkComponent } from "./AddSocialLinkComponent";

export default function InfoWrapper({ step }: { step: number }) {
  const [onboardStep, setOnboardStep] = useState(step);
  return (
    <>
      {onboardStep === 1 && (
        <ClaimYourRouteComponent setOnBoardStep={setOnboardStep} />
      )}
      {onboardStep === 2 && (
        <AddSocialLinkComponent setOnBoardStep={setOnboardStep} />
      )}
    </>
  );
}
