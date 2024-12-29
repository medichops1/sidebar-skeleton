import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  // You can add custom theme configuration here
  styles: {
    global: {
      body: {
        bg: "gray.50",
      },
    },
  },
});

export default theme;
