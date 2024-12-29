import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";

const userPool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || "",
  ClientId: import.meta.env.VITE_AWS_APP_CLIENT_ID || "",
});

interface UserAttributes {
  sub: string;
  email: string;
  name: string;
  "custom:userRole": string;
}

interface UserContextType {
  userAttributes: UserAttributes | null;
  isLoading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userAttributes, setUserAttributes] = useState<UserAttributes | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadUserAttributes = async () => {
      try {
        const cognitoUser = userPool.getCurrentUser();
        if (!cognitoUser) {
          setIsLoading(false);
          return;
        }

        cognitoUser.getSession((err: any, session: any) => {
          if (err) {
            setError(err);
            setIsLoading(false);
            return;
          }

          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              setError(err);
              setIsLoading(false);
              return;
            }

            if (attributes) {
              const userAttrs: UserAttributes = {
                sub:
                  attributes.find((attr) => attr.Name === "sub")?.Value || "",
                email:
                  attributes.find((attr) => attr.Name === "email")?.Value || "",
                name:
                  attributes.find((attr) => attr.Name === "name")?.Value || "",
                "custom:userRole":
                  attributes.find((attr) => attr.Name === "custom:userRole")
                    ?.Value || "",
              };
              setUserAttributes(userAttrs);
            }
            setIsLoading(false);
          });
        });
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    loadUserAttributes();
  }, []);

  return (
    <UserContext.Provider value={{ userAttributes, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
