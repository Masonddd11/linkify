import { generateState, generateCodeVerifier } from "arctic";
import { google } from "@/lib/oauth";
import { cookies } from "next/headers";
import {
  GOOGLE_OAUTH_COOKIE_OPTIONS,
  GOOGLE_OAUTH_SCOPES,
} from "@/lib/constants";

export async function GET(): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(
    state,
    codeVerifier,
    GOOGLE_OAUTH_SCOPES
  );

  const cookieStore = await cookies();
  cookieStore.set("google_oauth_state", state, GOOGLE_OAUTH_COOKIE_OPTIONS);
  cookieStore.set(
    "google_code_verifier",
    codeVerifier,
    GOOGLE_OAUTH_COOKIE_OPTIONS
  );

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
}
