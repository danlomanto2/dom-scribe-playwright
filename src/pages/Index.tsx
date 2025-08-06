import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Chrome, Sparkles, Download, ArrowRight } from "lucide-react";

const Index = () => {
  const [copied, setCopied] = useState(false);

  const extensionFiles = [
    { name: "manifest.json", description: "Extension configuration" },
    { name: "popup.html", description: "Extension popup interface" },
    { name: "content-script.js", description: "DOM scanning logic" },
    { name: "injected-script.js", description: "Shadow DOM access" },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Badge className="bg-gradient-primary text-primary-foreground px-4 py-2">
                <Chrome className="w-4 h-4 mr-2" />
                Chrome Extension Template
              </Badge>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Playwright POM Generator
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A Chrome extension that scans any webpage's DOM (including iframes & shadow DOMs) 
              and uses ChatGPT to auto-generate Playwright Page Object Model code.
            </p>

            <div className="flex justify-center space-x-4 pt-4">
              <Button className="bg-gradient-primary hover:opacity-90 shadow-glow">
                <Download className="w-4 h-4 mr-2" />
                Download Extension
              </Button>
              <Button variant="secondary">
                <Code className="w-4 h-4 mr-2" />
                View Source
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 border-border/50 bg-gradient-secondary">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Chrome className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Complete DOM Scanning</h3>
              <p className="text-muted-foreground">
                Scans all DOM elements including iframes and shadow DOMs for comprehensive coverage.
              </p>
            </div>
          </Card>

          <Card className="p-6 border-border/50 bg-gradient-secondary">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">AI-Powered Generation</h3>
              <p className="text-muted-foreground">
                Uses ChatGPT to generate clean, DRY Page Object Models with proper locators and methods.
              </p>
            </div>
          </Card>

          <Card className="p-6 border-border/50 bg-gradient-secondary">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Smart Locators</h3>
              <p className="text-muted-foreground">
                Generates reliable locators using data-testid, aria-labels, and other best practices.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center space-y-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Simple steps to generate professional Page Object Models
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto text-primary-foreground font-bold text-xl">
                1
              </div>
              <h3 className="font-semibold">Scan Page</h3>
              <p className="text-sm text-muted-foreground">
                Click the extension and scan the current webpage's DOM structure
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto text-primary-foreground font-bold text-xl">
                2
              </div>
              <h3 className="font-semibold">Add Prompt</h3>
              <p className="text-sm text-muted-foreground">
                Optionally specify what you want (e.g., "only the login form")
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto text-primary-foreground font-bold text-xl">
                3
              </div>
              <h3 className="font-semibold">Generate Code</h3>
              <p className="text-sm text-muted-foreground">
                Get clean TypeScript Page Object Model code ready to use
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Extension Files */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Extension Structure</h2>
            <p className="text-muted-foreground">
              The extension consists of these key files
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {extensionFiles.map((file, index) => (
              <Card key={index} className="p-4 border-border/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-mono text-sm font-medium">{file.name}</h3>
                    <p className="text-xs text-muted-foreground">{file.description}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Ready
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Built with React, TypeScript, and the Chrome Extensions API</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
