
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Shield, FileText } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to MCP Now</CardTitle>
          <CardDescription className="text-base">
            Before you start using MCP Now, please review and accept our terms and conditions.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    I agree to the Terms and Conditions
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openInNewTab('/terms')}
                    className="text-primary hover:text-primary/80"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    View
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Please read our terms and conditions which outline the rules and regulations for using MCP Now.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox
                id="privacy"
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="privacy"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    I agree to the Privacy Policy
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openInNewTab('/privacy')}
                    className="text-primary hover:text-primary/80"
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    View
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Learn how we collect, use, and protect your personal information.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              className="w-full"
              size="lg"
            >
              Continue to MCP Now
            </Button>
            {!canContinue && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Please accept both terms and privacy policy to continue
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsAcceptance;
