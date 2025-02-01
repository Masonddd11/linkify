"use server";

import z from "zod";
import { prisma } from "@/lib/db";
import { authedProcedure } from "@/lib/auth";

export const hasUserClaimedSlug = authedProcedure
  .createServerAction()
  .output(
    z.object({
      success: z.boolean(),
      isClaimed: z.boolean().optional(),
      message: z.string(),
    })
  )
  .handler(async ({ ctx }) => {
    const existingProfile = await prisma.userProfile.findFirst({
      where: {
        userId: ctx?.user?.id,
      },
    });

    if (!existingProfile || !existingProfile.slug) {
      return {
        success: true,
        isClaimed: false,
        message: "User has not claimed a link",
      };
    }

    return {
      success: true,
      isClaimed: true,
      message: "User has claimed a link",
    };
  });

export const claimSlug = authedProcedure
  .createServerAction()
  .input(
    z.object({
      slug: z.string(),
    })
  )
  .output(
    z.object({
      success: z.boolean(),
      message: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    const { slug } = input;

    const existingSlug = await prisma.userProfile.findFirst({
      where: {
        slug: {
          equals: slug,
          not: null,
        },
        userId: {
          not: ctx?.user?.id, // Exclude current user's profile
        },
      },
    });

    console.log("existingSlug", existingSlug);

    if (existingSlug) {
      return {
        success: false,
        message: "Slug is already claimed by another user",
      };
    }

    await prisma.userProfile.update({
      where: {
        userId: ctx?.user?.id,
      },
      data: {
        slug,
      },
    });

    return {
      success: true,
      message: "Slug claimed successfully",
    };
  });
