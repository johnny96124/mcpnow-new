
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { ServerProvider } from "@/context/ServerContext";
import DefaultLayout from "@/layouts/DefaultLayout";
import Dashboard from "@/pages/Dashboard";
import Hosts from "@/pages/Hosts";
import Servers from "@/pages/Servers";
import Profiles from "@/pages/Profiles";
import Discovery from "@/pages/Discovery";
import Settings from "@/pages/Settings";
import HostNewLayout from "./pages/Host-newlayout";
import NotFound from "./pages/NotFound";
import TrayPopup from "./pages/TrayPopup";
import NewUserTrayPopup from "./pages/NewUserTrayPopup";
import HostsNewUser from "./pages/HostsNewUser";
import Introduction3 from "./pages/Introduction-3";
import ProfileLandingPage from "./pages/ProfileLandingPage";
import ServerLandingPage from "./pages/ServerLandingPage";
import ProfileExpiredPage from "./pages/ProfileExpiredPage";
import ServerExpiredPage from "./pages/ServerExpiredPage";
import TermsAcceptance from "./pages/TermsAcceptance";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <ServerProvider>
          <Toaster />
          <RouterProvider router={createBrowserRouter([
            {
              path: "/terms-acceptance",
              element: <TermsAcceptance />
            },
            {
              path: "/terms",
              element: <TermsOfService />
            },
            {
              path: "/privacy",
              element: <PrivacyPolicy />
            },
            {
              path: "/",
              element: <ProtectedRoute><DefaultLayout><Hosts /></DefaultLayout></ProtectedRoute>
            },
            {
              path: "/index",
              element: <Navigate to="/" replace />
            },
            {
              path: "/introduction-3",
              element: <ProtectedRoute><Introduction3 /></ProtectedRoute>
            },
            {
              path: "/dashboard",
              element: <ProtectedRoute><DefaultLayout><Dashboard /></DefaultLayout></ProtectedRoute>
            },
            {
              path: "/hosts",
              element: <Navigate to="/" replace />
            },
            {
              path: "/hosts-new-user",
              element: <ProtectedRoute><DefaultLayout><HostsNewUser /></DefaultLayout></ProtectedRoute>
            },
            {
              path: "/servers",
              element: <ProtectedRoute><DefaultLayout><Servers /></DefaultLayout></ProtectedRoute>
            },
            {
              path: "/profiles",
              element: <ProtectedRoute><DefaultLayout><Profiles /></DefaultLayout></ProtectedRoute>
            },
            {
              path: "/discovery",
              element: <ProtectedRoute><DefaultLayout><Discovery /></DefaultLayout></ProtectedRoute>
            },
            {
              path: "/settings",
              element: <ProtectedRoute><DefaultLayout><Settings /></DefaultLayout></ProtectedRoute>
            },
            {
              path: "/host-new",
              element: <ProtectedRoute><DefaultLayout><HostNewLayout /></DefaultLayout></ProtectedRoute>
            },
            {
              path: "/shared-profile/:shareId",
              element: <ProfileLandingPage />
            },
            {
              path: "/shared-server/:shareId",
              element: <ServerLandingPage />
            },
            {
              path: "/shared-profile-expired",
              element: <ProfileExpiredPage />
            },
            {
              path: "/shared-server-expired",
              element: <ServerExpiredPage />
            },
            {
              path: "/tray",
              element: <ProtectedRoute><TrayPopup /></ProtectedRoute>
            },
            {
              path: "/tray-new-user",
              element: <ProtectedRoute><NewUserTrayPopup /></ProtectedRoute>
            },
            {
              path: "*",
              element: <ProtectedRoute><DefaultLayout><NotFound /></DefaultLayout></ProtectedRoute>
            }
          ])} />
        </ServerProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
