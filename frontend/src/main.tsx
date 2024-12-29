import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "react-oidc-context";
import { authConfig } from "./lib/auth-config";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider {...authConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
