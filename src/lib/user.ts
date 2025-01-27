import { prisma } from "./db";
import type { User } from "@prisma/client";

interface CreateUserInput {
  email: string;
  name: string;
  googleId?: string;
  image?: string;
  password?: string;
}

interface FindOrCreateGoogleUserInput {
  googleId: string;
  email: string;
  name: string;
  image?: string;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  return prisma.user.create({
    data: input,
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

  if (!user) {
    // Create new user
    user = await createUser({
      googleId: input.googleId,
      name: input.name,
      email: input.email,
      image: input.image,
    });
  } else if (!user.googleId) {
    // Link Google account to existing email user
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId: input.googleId,
        image: input.image || user.image,
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
