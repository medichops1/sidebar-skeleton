import React from "react";
import { Provider } from "./components/ui/provider";
import { AuthWrapper } from "./components/auth/auth-wrapper";
import { Toaster } from "./components/ui/toaster";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <Provider>
      <AuthWrapper>
        <UserProvider>
          {/* Your app routes/content here */}
          <Toaster />
        </UserProvider>
      </AuthWrapper>
    </Provider>
  );
}

export default App;
