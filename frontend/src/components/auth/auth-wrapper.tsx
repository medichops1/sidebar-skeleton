"use client";

import "../../lib/polyfills";
import React, { type PropsWithChildren, useState } from "react";
import {
  Box,
  Center,
  Container,
  HStack,
  Heading,
  Input,
  Link,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Button } from "../ui/button";
import { PasswordInput } from "../ui/password-input";
import { Field } from "../ui/field";
import { toaster } from "../ui/toaster";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import { AuthenticatedLayout } from "../layout/authenticated-layout";
import { UserProvider } from "../../context/UserContext";

const userPool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || "",
  ClientId: import.meta.env.VITE_AWS_APP_CLIENT_ID || "",
});

export function AuthWrapper({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNewPasswordRequired, setIsNewPasswordRequired] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [cognitoUser, setCognitoUser] = useState<CognitoUser | null>(null);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  console.log("Current states:", {
    isLoading,
    isNewPasswordRequired,
    isAuthenticated,
  });

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!cognitoUser) return;

    const requiredAttributes = {};

    cognitoUser.completeNewPasswordChallenge(newPassword, requiredAttributes, {
      onSuccess: (session) => {
        setIsAuthenticated(true);
        setIsNewPasswordRequired(false);
        setIsLoading(false);
      },
      onFailure: (err) => {
        toaster.create({
          title: "Password Change Error",
          description: err.message,
          type: "error",
          duration: 5000,
          meta: { closable: true },
        });
        setIsLoading(false);
      },
    });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const user = new CognitoUser({
      Username: credentials.email,
      Pool: userPool,
    });

    setCognitoUser(user);

    const authDetails = new AuthenticationDetails({
      Username: credentials.email,
      Password: credentials.password,
    });

    try {
      user.authenticateUser(authDetails, {
        onSuccess: (session) => {
          console.log("Authentication success");
          const { sub, email } = session.getIdToken().payload;
          setIsAuthenticated(true);
          setIsLoading(false);
        },
        onFailure: (err) => {
          console.log("Authentication failed:", err);
          toaster.create({
            title: "Authentication Error",
            description: err.message,
            type: "error",
            duration: 5000,
            meta: { closable: true },
          });
          setIsLoading(false);
        },
        newPasswordRequired: function (userAttributes) {
          console.log("New password required");
          setIsNewPasswordRequired(true);
          setIsLoading(false);
          console.log("States after new password required:", {
            isNewPasswordRequired: true,
            isLoading: false,
            isAuthenticated: false,
          });
        },
      });
    } catch (error) {
      console.log("Caught error:", error);
      setIsLoading(false);
      toaster.create({
        title: "Authentication Error",
        description: error.message,
        type: "error",
        duration: 5000,
        meta: { closable: true },
      });
    }
  };

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner />
      </Center>
    );
  }

  if (isNewPasswordRequired) {
    console.log("Rendering new password form");
    return (
      <Container maxW="md" py={{ base: "12", md: "24" }}>
        <Stack gap="8" as="form" onSubmit={handleNewPasswordSubmit}>
          <Stack gap={{ base: "2", md: "3" }} textAlign="center">
            <Heading size={{ base: "2xl", md: "3xl" }}>Change Password</Heading>
            <Text color="fg.muted">Please set a new password</Text>
          </Stack>
          <Stack gap="6">
            <Field label="New Password">
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Field>
            <Stack gap="4">
              <Button type="submit">Change Password</Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxW="md" py={{ base: "12", md: "24" }}>
        <Stack gap="8" as="form" onSubmit={handleSignIn}>
          <Stack gap={{ base: "2", md: "3" }} textAlign="center">
            <Heading size={{ base: "2xl", md: "3xl" }}>Welcome back</Heading>
            <Text color="fg.muted">Sign in to your account</Text>
          </Stack>

          <Stack gap="6">
            <Stack gap="5">
              <Field label="Email">
                <Input
                  type="email"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </Field>
              <Field label="Password">
                <PasswordInput
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
              </Field>
            </Stack>
            <HStack justify="space-between">
              <Button variant="plain" size="sm">
                Forgot password?
              </Button>
            </HStack>
            <Stack gap="4">
              <Button type="submit">Sign in</Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    );
  }

  return (
    <UserProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </UserProvider>
  );
}
