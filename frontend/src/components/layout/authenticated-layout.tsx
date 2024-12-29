import { Box, HStack } from "@chakra-ui/react";
import { Block } from "../navigation/block";
import { type PropsWithChildren } from "react";

export function AuthenticatedLayout({ children }: PropsWithChildren) {
  return (
    <HStack width="full" height="100vh" alignItems="stretch" spacing="0">
      <Block />
      <Box flex="1" overflowY="auto" p="6">
        {children}
      </Box>
    </HStack>
  );
}
