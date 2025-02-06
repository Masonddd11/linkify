import { prisma } from "./db";
import type { User, UserProfile } from "@prisma/client";

interface CreateUserInput {
  email: string;
  username: string;
  googleId?: string;
  image?: string;
  password?: string;
}

interface FindOrCreateGoogleUserInput {
  googleId: string;
  email: string;
  username: string;
  image?: string;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  return prisma.$transaction(async (tx) => {
    // Create the user
    const user = await tx.user.create({
      data: input,
    });

    // Create an empty user profile
    await tx.userProfile.create({
      data: {
        userId: user.id,
      },
    });

    return user;
  });
}

export async function findOrCreateGoogleUser(
  input: FindOrCreateGoogleUserInput
): Promise<User> {
  // Find user by googleId or email
  let user = await prisma.user.findFirst({
    where: {
      OR: [{ googleId: input.googleId }, { email: input.email }],
    },
  });

  const existingUser = await findUserByUsername(input.username);

  //generate new name
  if (existingUser) {
    input.username = await generateUniqueUsername(input.username);
  }

  if (!user) {
    // Create new user
    user = await createUser({
      googleId: input.googleId,
      username: input.username,
      email: input.email,
      image: input.image,
    });
  } else if (!user.googleId) {
    // Link Google account to existing email user
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId: input.googleId,
        image: user.image ? user.image : input.image,
      },
    });
  }

  return user;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserByUsername(
  username: string
): Promise<User | null> {
  return prisma.user.findUnique({
    where: { username },
  });
}

export async function generateUniqueUsername(
  baseUsername: string
): Promise<string> {
  // First try the base username
  const existingUser = await findUserByUsername(baseUsername);
  if (!existingUser) {
    return baseUsername;
  }

  // If base username is taken, try adding numbers until we find a unique one
  let counter = 1;
  while (true) {
    const newUsername = `${baseUsername}${counter}`;
    const existingUser = await findUserByUsername(newUsername);
    if (!existingUser) {
      return newUsername;
    }
    counter++;
  }
}

export async function sanitizeUsername(username: string): Promise<string> {
  // Remove any characters that aren't letters, numbers, or underscores
  // Also convert spaces to underscores and make lowercase
  const sanitized = username
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_{2,}/g, "_") // Replace multiple underscores with single underscore
    .replace(/^_+|_+$/g, ""); // Remove leading/trailing underscores
  return sanitized;
}

export function isValidUsername(username: string): boolean {
  return /^[a-z0-9_]+$/.test(username);
}

export function getUserById(
  id: number
): Promise<(User & { UserProfile: UserProfile | null }) | null> {
  return prisma.user.findUnique({
    where: { id },
    include: {
      UserProfile: true,
    },
  });
}

export function getProfileById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      UserProfile: true,
    },
  });
}

export function getProfileAndSocialsById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      UserProfile: {
        include: {
          socialLinks: true,
        },
      },
    },
  });
}

export async function getProfileAndSocialsAndWidgetsBySlug(slug: string) {
  return prisma.user.findFirst({
    where: {
      UserProfile: {
        slug,
      },
    },
    include: {
      UserProfile: {
        include: {
          socialLinks: true,
          widgets: {
            include: {
              textContent: true,
              linkContent: true,
              imageContent: true,
              embedContent: true,
              socialContent: true,
              layout: true,
            },
          },
        },
      },
    },
  });
}
