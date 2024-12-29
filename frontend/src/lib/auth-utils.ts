import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

const userPool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
  ClientId: import.meta.env.VITE_AWS_APP_CLIENT_ID,
});

export const authenticate = (
  username: string,
  password: string
): Promise<CognitoUserSession> => {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (session) => {
        resolve(session);
      },
      onFailure: (err) => {
        reject(err);
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        user.completeNewPasswordChallenge(
          password,
          {},
          {
            onSuccess: (session) => resolve(session),
            onFailure: (err) => reject(err),
          }
        );
      },
    });
  });
};

export const getCurrentUser = (): CognitoUser | null => {
  return userPool.getCurrentUser();
};

export const signOut = () => {
  const user = getCurrentUser();
  if (user) {
    user.signOut();
  }
};
