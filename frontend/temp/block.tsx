import { Navbar } from "../src/components/navigation/navbar";
import { Sidebar } from "../src/components/navigation/sidebar";

export const Block = () => {
  return (
    <>
      <Navbar hideFrom="md" />
      <Sidebar hideBelow="md" />
    </>
  );
};
