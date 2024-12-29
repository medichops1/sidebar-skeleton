import { AuthProviderProps } from "react-oidc-context";

const region = import.meta.env.VITE_AWS_REGION;
const userPoolId = import.meta.env.VITE_AWS_USER_POOL_ID;
const clientId = import.meta.env.VITE_AWS_APP_CLIENT_ID;
const domain = import.meta.env.VITE_AWS_COGNITO_DOMAIN;

if (!region || !userPoolId || !clientId || !domain) {
  console.error("Missing required environment variables:", {
    region,
    userPoolId,
    clientId,
    domain,
  });
}

export const authConfig: AuthProviderProps = {
  authority: `https://${domain}.auth.${region}.amazoncognito.com/`,
  client_id: clientId,
  redirect_uri: import.meta.env.VITE_AWS_REDIRECT_SIGN_IN,
  post_logout_redirect_uri: import.meta.env.VITE_AWS_REDIRECT_SIGN_OUT,
  scope: "openid profile email",
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};
