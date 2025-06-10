import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";

const TermsOfService = () => {
  const handleGoBack = () => {
    window.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Terms and Conditions
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <p className="text-slate-600 dark:text-slate-400">Last updated: June 10, 2025</p>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="hover:bg-blue-50 dark:hover:bg-blue-950/30 border-slate-300 dark:border-slate-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
          <CardContent className="p-10 prose prose-slate dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-li:text-slate-700 dark:prose-li:text-slate-300">
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
