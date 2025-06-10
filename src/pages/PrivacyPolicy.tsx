
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Shield } from "lucide-react";

const PrivacyPolicy = () => {
  const handleGoBack = () => {
    window.close();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: June 10, 2025</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>

        <Card>
          <CardContent className="p-8 prose prose-gray dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
              <p className="mb-4">We collect information you provide directly to us, such as:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>MCP server configurations and settings</li>
                <li>Host connection details</li>
                <li>Profile configurations</li>
                <li>Usage patterns and preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process transactions and send related information</li>
                <li>Monitor and analyze trends and usage</li>
                <li>Detect, investigate, and prevent fraudulent transactions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. Information Sharing and Disclosure</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
              </p>
              <p className="mb-4">We may share your information in the following situations:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Data Retention</h2>
              <p className="mb-4">
                We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to processing of your information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Cookies and Tracking</h2>
              <p className="mb-4">
                We use cookies and similar tracking technologies to collect information about your browsing activities and to improve your experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">8. Changes to This Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">9. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at privacy@mcpnow.com.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
