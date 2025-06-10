
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Shield, FileText, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const TermsAcceptance = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (termsAccepted && privacyAccepted) {
      // Save acceptance to localStorage
      localStorage.setItem('termsAccepted', 'true');
      localStorage.setItem('privacyAccepted', 'true');
      localStorage.setItem('acceptanceTimestamp', new Date().toISOString());
      
      toast({
        title: "Welcome to MCP Now",
        description: "Thank you for accepting our terms and privacy policy.",
      });
      
      navigate('/');
    }
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const canContinue = termsAccepted && privacyAccepted;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-8 space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Welcome to MCP Now
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Your intelligent Model Context Protocol management platform
            </p>
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-slate-900 dark:text-white">
              Before we begin
            </CardTitle>
            <CardDescription className="text-center text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Please review and accept our terms to continue with your AI-powered MCP experience
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 px-8 pb-8">
            <div className="space-y-4">
              {/* Terms Checkbox */}
              <div className="group flex items-start space-x-4 p-5 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all duration-200">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  className="mt-1 h-5 w-5 border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium text-slate-900 dark:text-white cursor-pointer group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors"
                    >
                      I agree to the Terms and Conditions
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openInNewTab('/terms')}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/30 h-8 px-3"
                    >
                      <FileText className="w-4 h-4 mr-1.5" />
                      View Terms
                      <ExternalLink className="w-3 h-3 ml-1.5" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Understand the rules and guidelines for using our AI-powered MCP platform
                  </p>
                </div>
              </div>

              {/* Privacy Checkbox */}
              <div className="group flex items-start space-x-4 p-5 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all duration-200">
                <Checkbox
                  id="privacy"
                  checked={privacyAccepted}
                  onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                  className="mt-1 h-5 w-5 border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="privacy"
                      className="text-sm font-medium text-slate-900 dark:text-white cursor-pointer group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors"
                    >
                      I agree to the Privacy Policy
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openInNewTab('/privacy')}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/30 h-8 px-3"
                    >
                      <Shield className="w-4 h-4 mr-1.5" />
                      View Policy
                      <ExternalLink className="w-3 h-3 ml-1.5" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Learn how we protect and handle your data with industry-leading security
                  </p>
                </div>
              </div>
            </div>

            {/* Continue Button Section */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button
                onClick={handleContinue}
                disabled={!canContinue}
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 disabled:text-slate-500 shadow-lg disabled:shadow-none transition-all duration-200"
                size="lg"
              >
                {canContinue ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Continue to MCP Now
                  </>
                ) : (
                  "Please accept both agreements to continue"
                )}
              </Button>
              {!canContinue && (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-3">
                  Your acceptance helps us provide a better AI experience
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Powered by advanced AI technology for seamless MCP management
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAcceptance;
