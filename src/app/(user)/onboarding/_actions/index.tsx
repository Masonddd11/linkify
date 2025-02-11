"use server";

import z from "zod";
import { prisma } from "@/lib/db";
import { authedProcedure } from "@/lib/auth";
import { uploadProfileImage } from "@/lib/cloudinary";
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
      links: z.record(z.object({
        url: z.string(),
        handle: z.string()
      }))
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

      // Get user profile
      const userProfile = await prisma.userProfile.findUnique({
        where: { userId: ctx?.user?.id },
      });

      if (!userProfile) {
        throw new Error("User profile not found");
      }

      // Delete existing links
      await prisma.socialLink.deleteMany({
        where: { profileId: userProfile.id },
      });

      // Create new social links
      const socialLinksPromises = Object.entries(links).map(
        ([platform, { url, handle }]) => {
          if (!url) return null;
          return prisma.socialLink.create({
            data: {
              platform: platform as PLATFORM,
              url,
              handle,
              profileId: userProfile.id,
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

      await prisma.user.update({
        where: {
          id: ctx?.user?.id,
        },
        data: {
          isOnboarded: true,
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

export const updateUserProfilePicture = authedProcedure
  .createServerAction()
  .input(
    z.object({
      image: z.instanceof(File),
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
      const { image } = input;

      // Validate file type
      if (!image.type.startsWith("image/")) {
        throw new Error("File must be an image");
      }

      // Validate file size (max 10MB)
      if (image.size > 10 * 1024 * 1024) {
        throw new Error("File size must be less than 10MB");
      }

      const bytes = await image.arrayBuffer();
      const buffer = new Uint8Array(bytes);
      const userId = ctx?.user?.id;

      if (!userId) throw new Error("User not found");

      const result = await uploadProfileImage({
        buffer,
        userId,
        tags: ["profile_picture", `user_${userId}`],
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
        ],
      });

      await prisma.user.update({
        where: { id: userId },
        data: { image: result.secure_url },
      });

      return {
        success: true,
        message: "User profile picture updated successfully",
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
