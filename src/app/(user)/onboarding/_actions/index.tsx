"use server";

import z from "zod";
import { prisma } from "@/lib/db";
import { authedProcedure } from "@/lib/auth";
import { PLATFORM } from "@prisma/client";

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

export const saveSocialLinks = authedProcedure
  .createServerAction()
  .input(
    z.object({
      links: z.record(z.string()),
    })
  )
  .output(
    z.object({
      success: z.boolean(),
      message: z.string(),
    })
  )
  .handler(async ({ ctx, input }) => {
    try {
      const { links } = input;

      await prisma.socialLink.deleteMany({
        where: {
          profileId: (
            await prisma.userProfile.findUnique({
              where: { userId: ctx?.user?.id },
              select: { id: true },
            })
          )?.id,
        },
      });

      // Get user profile
      const userProfile = await prisma.userProfile.findUnique({
        where: { userId: ctx?.user?.id },
      });

      if (!userProfile) {
        throw new Error("User profile not found");
      }

      // Create new social links
      const socialLinksPromises = Object.entries(links).map(
        ([platform, url]) => {
          if (!url) return null;
          return prisma.socialLink.create({
            data: {
              platform: platform as PLATFORM,
              url,
              profileId: userProfile.id,
              handle: "",
            },
          });
        }
      );

      await Promise.all(socialLinksPromises.filter(Boolean));

      return {
        success: true,
        message: "Social links saved successfully",
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        };
      } else {
        return {
          success: false,
          message: "An unexpected error occurred",
        };
      }
    }
  });

export const saveUserInfo = authedProcedure
  .createServerAction()
  .input(
    z.object({
      displayName: z.string(),
      bio: z.string(),
    })
  )
  .output(
    z.object({
      success: z.boolean(),
      message: z.string(),
    })
  )
  .handler(async ({ ctx, input }) => {
    try {
      const { displayName, bio } = input;

      await prisma.userProfile.update({
        where: {
          userId: ctx?.user?.id,
        },
        data: {
          displayName,
          bio,
        },
      });

      return {
        success: true,
        message: "User profile updated successfully",
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        };
      } else {
        return {
          success: false,
          message: "An unexpected error occurred",
        };
      }
    }
  });
