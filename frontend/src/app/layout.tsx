import { Provider } from "@/components/ui/provider";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <AuthWrapper>{children}</AuthWrapper>
        </Provider>
      </body>
    </html>
  );
}
