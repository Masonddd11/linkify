import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "@/lib/session";
import { google } from "@/lib/oauth";
import { cookies } from "next/headers";
import { decodeIdToken } from "arctic";
import { findOrCreateGoogleUser, sanitizeUsername } from "@/lib/user";

import type { OAuth2Tokens } from "arctic";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;

  if (!code || !state || !storedState || !codeVerifier) {
    return new Response(null, {
      status: 400,
    });
  }

  if (state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    return new Response(null, {
      status: 400,
    });
  }

  interface GoogleIdTokenClaims {
    sub: string;
    name: string;
    email: string;
    picture?: string;
    email_verified?: boolean;
  }

  const claims = decodeIdToken(tokens.idToken()) as GoogleIdTokenClaims;

  // Find or create user using the extracted function

  const sanitizedUsername = await sanitizeUsername(claims.name);
  const user = await findOrCreateGoogleUser({
    googleId: claims.sub,
    username: sanitizedUsername,
    email: claims.email,
    image: claims.picture,
  });

  // Create session
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/onboarding",
    },
  });
}
