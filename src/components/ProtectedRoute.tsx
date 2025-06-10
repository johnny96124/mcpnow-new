
import React from "react";
import { Navigate } from "react-router-dom";
import { hasAcceptedTerms } from "@/utils/termsAcceptance";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!hasAcceptedTerms()) {
    return <Navigate to="/terms-acceptance" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
