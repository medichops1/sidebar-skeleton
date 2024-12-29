import { Heading } from "@chakra-ui/react";

export const Logo = ({ style }: { style?: React.CSSProperties }) => {
  return (
    <Heading size="md" style={style}>
      ATS Lite
    </Heading>
  );
};
