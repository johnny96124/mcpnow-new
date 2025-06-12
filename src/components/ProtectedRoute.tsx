
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { hasAcceptedTerms } from "@/utils/termsAcceptance";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isConfigured } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If Supabase is not configured, allow access but show a warning
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <div className="text-yellow-600 text-6xl">⚠️</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Supabase Not Configured
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            To enable authentication, please set up your Supabase environment variables:
          </p>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-left text-sm font-mono">
            <div>VITE_SUPABASE_URL=your_supabase_url</div>
            <div>VITE_SUPABASE_ANON_KEY=your_anon_key</div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            For now, you can continue without authentication.
          </p>
          <div>{children}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAcceptedTerms()) {
    return <Navigate to="/terms-acceptance" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
