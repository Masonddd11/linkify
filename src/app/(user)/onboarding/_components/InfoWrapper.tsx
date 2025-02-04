"use client";

import { ClaimYourRouteComponent } from "./ClaimYourRouteComponent";
import { useState } from "react";
import { AddSocialLinkComponent } from "./AddSocialLinkComponent";
import { UserInfoComponent } from "./UserInfoComponent";
import { Prisma } from "@prisma/client";

export default function InfoWrapper({
  step,
  user,
}: {
  step: number;
  user: Prisma.UserGetPayload<{
    include: {
      UserProfile: {
        include: {
          socialLinks: true;
        };
      };
    };
  }>;
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

      {onboardStep === 3 && user.UserProfile && (
        <UserInfoComponent setOnBoardStep={setOnboardStep} user={user} />
      )}
    </>
  );
}
