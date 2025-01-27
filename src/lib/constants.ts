export const GOOGLE_OAUTH_COOKIE_EXPIRY = 60 * 10; // 10 minutes
export const GOOGLE_OAUTH_COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: GOOGLE_OAUTH_COOKIE_EXPIRY,
  sameSite: "lax" as const,
};

export const GOOGLE_OAUTH_SCOPES = ["openid", "profile", "email"];
