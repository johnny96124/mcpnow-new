
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";

const TermsOfService = () => {
  const handleGoBack = () => {
    window.close();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Terms and Conditions</h1>
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
              <h2 className="text-xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p className="mb-4">
                By accessing and using MCP Now ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
              <p className="mb-4">
                MCP Now is a management platform for Model Context Protocol (MCP) servers, hosts, and profiles. The Service allows users to:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Manage MCP server instances</li>
                <li>Configure host connections</li>
                <li>Create and manage profiles</li>
                <li>Monitor server status and performance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. User Responsibilities</h2>
              <p className="mb-4">You agree to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Use the Service in compliance with all applicable laws and regulations</li>
                <li>Not use the Service for any unlawful or prohibited activities</li>
                <li>Maintain the security of your account credentials</li>
                <li>Not attempt to gain unauthorized access to the Service or its related systems</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Data Collection and Usage</h2>
              <p className="mb-4">
                We collect and process certain data to provide and improve our Service. This includes:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Configuration data for your MCP servers and hosts</li>
                <li>Usage analytics and performance metrics</li>
                <li>Error logs and diagnostic information</li>
              </ul>
              <p className="mb-4">
                For detailed information about our data practices, please refer to our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Limitation of Liability</h2>
              <p className="mb-4">
                The Service is provided "as is" without warranty of any kind. We shall not be liable for any damages arising from the use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Modifications to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms and Conditions, please contact us at support@mcpnow.com.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
