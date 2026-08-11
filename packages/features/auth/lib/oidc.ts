export const OIDC_CLIENT_ID = process.env.OIDC_CLIENT_ID;
export const OIDC_CLIENT_SECRET = process.env.OIDC_CLIENT_SECRET;
// Strip a trailing slash so wellKnown URL construction never produces a double slash.
export const OIDC_ISSUER = process.env.OIDC_ISSUER?.replace(/\/+$/, "");
export const OIDC_PROVIDER_NAME = process.env.OIDC_PROVIDER_NAME || "SSO";
export const OIDC_LOGIN_ENABLED = process.env.OIDC_LOGIN_ENABLED === "true";
export const IS_OIDC_LOGIN_ENABLED = !!(
  OIDC_CLIENT_ID &&
  OIDC_CLIENT_SECRET &&
  OIDC_ISSUER &&
  OIDC_LOGIN_ENABLED
);
