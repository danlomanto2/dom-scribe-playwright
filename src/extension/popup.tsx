import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Code, Copy, Sparkles, Settings, Download, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface DOMData {
  elements: any[];
  timestamp: number;
  url: string;
}

interface GeneratedPOM {
  code: string;
  className: string;
  description: string;
}

export const Popup = () => {
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [domData, setDomData] = useState<DOMData | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Load saved API key
    chrome.storage.sync.get(["openaiApiKey"], (result) => {
      if (result.openaiApiKey) {
        setApiKey(result.openaiApiKey);
      }
    });
  }, []);

  const saveApiKey = () => {
    chrome.storage.sync.set({ openaiApiKey: apiKey }, () => {
      toast.success("API key saved!");
    });
  };

  const scanCurrentPage = async () => {
    setIsScanning(true);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.id) {
        throw new Error("No active tab found");
      }

      // Inject and execute content script
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: scanDOM,
      });

      const data = results[0].result;
      setDomData({
        elements: data.elements,
        timestamp: Date.now(),
        url: tab.url || ""
      });
      
      toast.success(`Scanned ${data.elements.length} elements`);
    } catch (error) {
      console.error("Error scanning page:", error);
      toast.error("Failed to scan page");
    } finally {
      setIsScanning(false);
    }
  };

  const generatePOM = async () => {
    if (!apiKey) {
      toast.error("Please set your OpenAI API key first");
      return;
    }

    if (!domData) {
      toast.error("Please scan the page first");
      return;
    }

    setIsGenerating(true);
    try {
      const pomCode = await generatePageObjectModel(domData, prompt, apiKey);
      setGeneratedCode(pomCode);
      toast.success("Page Object Model generated!");
    } catch (error) {
      console.error("Error generating POM:", error);
      toast.error("Failed to generate POM");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success("Code copied to clipboard!");
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "page-object-model.ts";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-96 h-[600px] bg-background p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Code className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold">POM Generator</h1>
          <p className="text-xs text-muted-foreground">Playwright Page Object Models</p>
        </div>
      </div>

      {/* API Key Section */}
      <Card className="p-3 space-y-2">
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">OpenAI API Key</span>
        </div>
        <div className="flex space-x-2">
          <Input
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="text-xs"
          />
          <Button onClick={saveApiKey} size="sm" variant="secondary">
            Save
          </Button>
        </div>
      </Card>

      {/* Scan Section */}
      <Card className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current Page</span>
          {domData && (
            <Badge variant="secondary" className="text-xs">
              {domData.elements.length} elements
            </Badge>
          )}
        </div>
        <Button 
          onClick={scanCurrentPage} 
          disabled={isScanning}
          className="w-full bg-gradient-primary hover:opacity-90"
        >
          {isScanning ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Scanning...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Scan DOM</span>
            </div>
          )}
        </Button>
      </Card>

      {/* Prompt Section */}
      <Card className="p-3 space-y-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Generation Prompt</span>
        </div>
        <Textarea
          placeholder="Optional: Describe what you want (e.g., 'only the login modal' or 'navigation menu only')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[60px] text-xs"
        />
        <Button 
          onClick={generatePOM}
          disabled={isGenerating || !domData}
          className="w-full bg-gradient-primary hover:opacity-90"
        >
          {isGenerating ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Generating...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Generate POM</span>
            </div>
          )}
        </Button>
      </Card>

      {/* Generated Code Section */}
      {generatedCode && (
        <Card className="p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Generated Code</span>
            <div className="flex space-x-1">
              <Button onClick={copyCode} size="sm" variant="secondary">
                <Copy className="w-3 h-3" />
              </Button>
              <Button onClick={downloadCode} size="sm" variant="secondary">
                <Download className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <ScrollArea className="h-32 w-full rounded-md border bg-code-bg p-2">
            <pre className="text-xs text-foreground font-mono">
              <code>{generatedCode}</code>
            </pre>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};

// Function to be injected into the page
function scanDOM() {
  const elements: any[] = [];
  
  function processElement(element: Element, context = "main") {
    if (element.nodeType !== Node.ELEMENT_NODE) return;
    
    const tagName = element.tagName.toLowerCase();
    const id = element.id;
    const className = element.className;
    const textContent = element.textContent?.trim().substring(0, 100);
    const role = element.getAttribute("role");
    const ariaLabel = element.getAttribute("aria-label");
    const dataTestId = element.getAttribute("data-testid");
    const placeholder = element.getAttribute("placeholder");
    const type = element.getAttribute("type");
    
    // Skip if no useful identifying information
    if (!id && !className && !role && !ariaLabel && !dataTestId && !placeholder && !type && !textContent) {
      return;
    }
    
    elements.push({
      tagName,
      id,
      className: typeof className === "string" ? className : "",
      textContent,
      role,
      ariaLabel,
      dataTestId,
      placeholder,
      type,
      context,
      selector: generateSelector(element)
    });
  }
  
  function generateSelector(element: Element): string {
    // Generate multiple selector options
    const selectors = [];
    
    if (element.id) {
      selectors.push(`#${element.id}`);
    }
    
    if (element.getAttribute("data-testid")) {
      selectors.push(`[data-testid="${element.getAttribute("data-testid")}"]`);
    }
    
    if (element.getAttribute("aria-label")) {
      selectors.push(`[aria-label="${element.getAttribute("aria-label")}"]`);
    }
    
    if (element.getAttribute("role")) {
      selectors.push(`[role="${element.getAttribute("role")}"]`);
    }
    
    // Class-based selector (simplified)
    if (element.className && typeof element.className === "string") {
      const classes = element.className.split(" ").filter(c => c.length > 0);
      if (classes.length > 0) {
        selectors.push(`.${classes[0]}`);
      }
    }
    
    return selectors[0] || element.tagName.toLowerCase();
  }
  
  function scanShadowDOM(element: Element) {
    if (element.shadowRoot) {
      element.shadowRoot.querySelectorAll("*").forEach(el => {
        processElement(el, "shadow");
        scanShadowDOM(el);
      });
    }
  }
  
  function scanIframes() {
    document.querySelectorAll("iframe").forEach((iframe, index) => {
      try {
        if (iframe.contentDocument) {
          iframe.contentDocument.querySelectorAll("*").forEach(el => {
            processElement(el, `iframe-${index}`);
          });
        }
      } catch (e) {
        // Cross-origin iframe, can't access
        console.log(`Cannot access iframe ${index} due to cross-origin restrictions`);
      }
    });
  }
  
  // Scan main document
  document.querySelectorAll("*").forEach(element => {
    processElement(element);
    scanShadowDOM(element);
  });
  
  // Scan iframes
  scanIframes();
  
  return { elements };
}

async function generatePageObjectModel(domData: DOMData, prompt: string, apiKey: string): Promise<string> {
  const systemPrompt = `You are an expert in Playwright test automation and Page Object Model patterns. Generate a TypeScript Page Object Model class based on the provided DOM elements.

Requirements:
1. Create a clean, DRY (Don't Repeat Yourself) TypeScript class
2. Use proper Playwright locators (page.locator(), page.getByRole(), etc.)
3. Include encapsulated functionality methods (like login, search, etc.)
4. Follow naming conventions: PascalCase for class, camelCase for methods
5. Add JSDoc comments for complex methods
6. Prefer data-testid, id, and aria-label selectors when available
7. Group related functionality into logical methods
8. Include proper error handling in complex methods

The class should extend a base page class and include:
- Constructor that takes a Page object
- Locator properties for elements
- Action methods that encapsulate common workflows
- Assertion methods where appropriate`;

  const userPrompt = `Based on these DOM elements from ${domData.url}, generate a Playwright Page Object Model:

${JSON.stringify(domData.elements, null, 2)}

${prompt ? `Additional requirements: ${prompt}` : ""}

Generate a complete TypeScript class that I can copy and paste directly into my Playwright project.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}