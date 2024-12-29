import { Box, HStack, IconButton, Text } from "@chakra-ui/react";
import { HiEllipsisVertical } from "react-icons/hi2";
import { Avatar } from "../ui/avatar";
import { useUser } from "../../context/UserContext";

export const UserProfile = () => {
  const { userAttributes, isLoading } = useUser();

  if (isLoading) {
    return (
      <HStack gap="3" justify="space-between">
        <HStack gap="3">
          <Avatar />
          <Box>
            <Text textStyle="sm" fontWeight="medium">
              Loading...
            </Text>
          </Box>
        </HStack>
      </HStack>
    );
  }

  return (
    <HStack gap="3" justify="space-between">
      <HStack gap="3">
        <Avatar name={userAttributes?.name} />
        <Box>
          <Text textStyle="sm" fontWeight="medium">
            {userAttributes?.name || "Unknown User"}
          </Text>
          <Text textStyle="sm" color="fg.muted">
            {userAttributes?.email || "No email"}
          </Text>
        </Box>
      </HStack>
      <IconButton variant="ghost" colorPalette="gray" aria-label="Open Menu">
        <HiEllipsisVertical />
      </IconButton>
    </HStack>
  );
};
