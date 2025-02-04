"use client";

import { ClaimYourRouteComponent } from "./ClaimYourRouteComponent";
import { useState } from "react";
import { AddSocialLinkComponent } from "./AddSocialLinkComponent";
import { UserInfoComponent } from "./UserInfoComponent";
import { User } from "@prisma/client";

export default function InfoWrapper({
  step,
  user,
}: {
  step: number;
  user: User;
}) {
  const [onboardStep, setOnboardStep] = useState(step);
  return (
    <>
      {onboardStep === 1 && (
        <ClaimYourRouteComponent setOnBoardStep={setOnboardStep} />
      )}
      {onboardStep === 2 && (
        <AddSocialLinkComponent setOnBoardStep={setOnboardStep} />
      )}

      {onboardStep === 3 && (
        <UserInfoComponent setOnBoardStep={setOnboardStep} user={user} />
      )}
    </>
  );
}
