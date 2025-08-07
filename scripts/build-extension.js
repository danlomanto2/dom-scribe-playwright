#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create extension directory
function createExtensionDirectory() {
  const extensionDir = 'chrome-extension';
  if (!fs.existsSync(extensionDir)) {
    fs.mkdirSync(extensionDir, { recursive: true });
  }
  return extensionDir;
}

// Copy manifest and static files
function copyStaticFiles(extensionDir) {
  console.log('Copying static files...');
  
  // Copy manifest and static files
  const filesToCopy = ['manifest.json', 'popup.html', 'popup.css'];
  filesToCopy.forEach(file => {
    const srcPath = path.join('public', file);
    const destPath = path.join(extensionDir, file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file}`);
    }
  });

  // Copy icon files
  const iconFiles = fs.readdirSync('public').filter(file => file.startsWith('icon') && file.endsWith('.png'));
  iconFiles.forEach(file => {
    const srcPath = path.join('public', file);
    const destPath = path.join(extensionDir, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file}`);
  });
}

// Create popup component bundle
function createPopupComponent(extensionDir) {
  console.log('Creating popup component...');
  
  const popupComponentContent = `// Simplified popup component for Chrome extension
const { useState, useEffect } = React;

function Popup() {
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [domData, setDomData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(['openaiApiKey'], (result) => {
      if (result.openaiApiKey) {
        setApiKey(result.openaiApiKey);
      }
    });
  }, []);

  const saveApiKey = () => {
    chrome.storage.sync.set({ openaiApiKey: apiKey }, () => {
      console.log('API key saved!');
    });
  };

  const scanCurrentPage = async () => {
    setIsScanning(true);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: scanDOM,
      });
      setDomData(results[0].result);
      console.log('Page scanned successfully');
    } catch (error) {
      console.error('Error scanning page:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const generatePOM = async () => {
    if (!apiKey || !domData) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${apiKey}\`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Generate a TypeScript Playwright Page Object Model based on the provided DOM elements. Include proper locators and encapsulated methods.'
            },
            {
              role: 'user',
              content: \`Create a POM for: \${JSON.stringify(domData)}. \${prompt ? \`Focus on: \${prompt}\` : ''}\`
            }
          ],
          temperature: 0.2,
          max_tokens: 2000,
        }),
      });
      
      const data = await response.json();
      setGeneratedCode(data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating POM:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  return React.createElement('div', { 
    className: 'w-96 h-[600px] bg-gray-900 text-white p-4 space-y-4' 
  }, [
    // Header
    React.createElement('div', { 
      key: 'header',
      className: 'flex items-center space-x-2' 
    }, [
      React.createElement('h1', { 
        key: 'title',
        className: 'text-lg font-bold' 
      }, 'POM Generator')
    ]),
    
    // API Key Section
    React.createElement('div', { 
      key: 'api-section',
      className: 'space-y-2' 
    }, [
      React.createElement('label', { 
        key: 'label',
        className: 'text-sm font-medium' 
      }, 'OpenAI API Key'),
      React.createElement('div', { 
        key: 'input-group',
        className: 'flex space-x-2' 
      }, [
        React.createElement('input', {
          key: 'input',
          type: 'password',
          placeholder: 'sk-...',
          value: apiKey,
          onChange: (e) => setApiKey(e.target.value),
          className: 'flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm'
        }),
        React.createElement('button', {
          key: 'save-btn',
          onClick: saveApiKey,
          className: 'px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm'
        }, 'Save')
      ])
    ]),
    
    // Scan Section
    React.createElement('button', {
      key: 'scan-btn',
      onClick: scanCurrentPage,
      disabled: isScanning,
      className: 'w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded'
    }, isScanning ? 'Scanning...' : 'Scan DOM'),
    
    // Prompt Section
    React.createElement('div', { 
      key: 'prompt-section',
      className: 'space-y-2' 
    }, [
      React.createElement('label', { 
        key: 'prompt-label',
        className: 'text-sm font-medium' 
      }, 'Generation Prompt (Optional)'),
      React.createElement('textarea', {
        key: 'prompt-input',
        placeholder: 'e.g., "only the login modal"',
        value: prompt,
        onChange: (e) => setPrompt(e.target.value),
        className: 'w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm h-16'
      })
    ]),
    
    // Generate Button
    React.createElement('button', {
      key: 'generate-btn',
      onClick: generatePOM,
      disabled: isGenerating || !domData,
      className: 'w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded'
    }, isGenerating ? 'Generating...' : 'Generate POM'),
    
    // Generated Code Section
    generatedCode && React.createElement('div', { 
      key: 'code-section',
      className: 'space-y-2' 
    }, [
      React.createElement('div', { 
        key: 'code-header',
        className: 'flex justify-between items-center' 
      }, [
        React.createElement('span', { 
          key: 'code-title',
          className: 'text-sm font-medium' 
        }, 'Generated Code'),
        React.createElement('button', {
          key: 'copy-btn',
          onClick: copyCode,
          className: 'px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs'
        }, 'Copy')
      ]),
      React.createElement('pre', {
        key: 'code-display',
        className: 'bg-gray-800 p-3 rounded text-xs overflow-auto max-h-32'
      }, React.createElement('code', {}, generatedCode))
    ])
  ]);
}

// DOM scanning function
function scanDOM() {
  const elements = [];
  document.querySelectorAll('*').forEach(element => {
    if (element.id || element.className || element.getAttribute('data-testid')) {
      elements.push({
        tagName: element.tagName.toLowerCase(),
        id: element.id,
        className: element.className,
        textContent: element.textContent?.trim().substring(0, 100),
        dataTestId: element.getAttribute('data-testid')
      });
    }
  });
  return { elements };
}

window.Popup = Popup;`;

  fs.writeFileSync(path.join(extensionDir, 'popup-component.js'), popupComponentContent);
  console.log('Created popup-component.js');
}

// Create popup entry point
function createPopupEntry(extensionDir) {
  console.log('Creating popup entry point...');
  
  const popupEntryContent = `// Chrome Extension Popup Entry Point
import { createRoot } from 'react-dom/client';
import { Popup } from './popup-component.js';

// Initialize the popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('popup-root');
  if (container) {
    const root = createRoot(container);
    root.render(React.createElement(Popup));
  }
});`;

  fs.writeFileSync(path.join(extensionDir, 'popup.js'), popupEntryContent);
  console.log('Created popup.js');
}

// Bundle extension scripts
function bundleExtensionScripts(extensionDir) {
  console.log('Bundling extension scripts...');
  
  // Copy content script
  const contentScriptSrc = 'src/extension/content-script.ts';
  const contentScriptDest = path.join(extensionDir, 'content-script.js');
  if (fs.existsSync(contentScriptSrc)) {
    let content = fs.readFileSync(contentScriptSrc, 'utf8');
    // Remove TypeScript-specific syntax for basic compatibility
    content = content.replace(/: any|: string|: number|: boolean|: Element|: Document/g, '');
    fs.writeFileSync(contentScriptDest, content);
    console.log('Created content-script.js');
  }

  // Copy injected script
  const injectedScriptSrc = 'src/extension/injected-script.ts';
  const injectedScriptDest = path.join(extensionDir, 'injected-script.js');
  if (fs.existsSync(injectedScriptSrc)) {
    let content = fs.readFileSync(injectedScriptSrc, 'utf8');
    // Remove TypeScript-specific syntax for basic compatibility
    content = content.replace(/: any|: string|: number|: boolean|: Element|: Document/g, '');
    fs.writeFileSync(injectedScriptDest, content);
    console.log('Created injected-script.js');
  }
}

// Update popup.html for extension
function updatePopupHtml(extensionDir) {
  console.log('Creating popup.html...');
  
  const popupHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playwright POM Generator</title>
    <style>
        body {
            margin: 0;
            min-width: 400px;
            min-height: 500px;
            background: #111827;
            color: #f9fafb;
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
        }
        .w-96 { width: 24rem; }
        .h-\\[600px\\] { height: 600px; }
        .bg-gray-900 { background-color: #111827; }
        .text-white { color: #ffffff; }
        .p-4 { padding: 1rem; }
        .space-y-4 > * + * { margin-top: 1rem; }
        .space-y-2 > * + * { margin-top: 0.5rem; }
        .space-x-2 > * + * { margin-left: 0.5rem; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .text-lg { font-size: 1.125rem; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .font-bold { font-weight: 700; }
        .font-medium { font-weight: 500; }
        .flex-1 { flex: 1 1 0%; }
        .w-full { width: 100%; }
        .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .bg-gray-800 { background-color: #1f2937; }
        .bg-gray-700 { background-color: #374151; }
        .bg-gray-600 { background-color: #4b5563; }
        .bg-purple-600 { background-color: #9333ea; }
        .bg-purple-700 { background-color: #7c3aed; }
        .border { border-width: 1px; }
        .border-gray-700 { border-color: #374151; }
        .rounded { border-radius: 0.25rem; }
        .h-16 { height: 4rem; }
        .max-h-32 { max-height: 8rem; }
        .overflow-auto { overflow: auto; }
        .disabled\\:opacity-50:disabled { opacity: 0.5; }
        .hover\\:bg-purple-700:hover { background-color: #7c3aed; }
        .hover\\:bg-gray-600:hover { background-color: #4b5563; }
        button:disabled { cursor: not-allowed; }
        input, textarea, button { outline: none; }
        input:focus, textarea:focus { border-color: #9333ea; }
    </style>
</head>
<body>
    <div id="popup-root"></div>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="popup-component.js"></script>
    <script src="popup.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(extensionDir, 'popup.html'), popupHtmlContent);
  console.log('Created popup.html');
}

// Main build function
function buildExtension() {
  console.log('Building Chrome Extension...');
  
  const extensionDir = createExtensionDirectory();
  copyStaticFiles(extensionDir);
  createPopupComponent(extensionDir);
  createPopupEntry(extensionDir);
  bundleExtensionScripts(extensionDir);
  updatePopupHtml(extensionDir);
  
  console.log('\\n✅ Chrome extension built successfully!');
  console.log(\`📁 Extension files are in: \${extensionDir}/\`);
  console.log('🚀 Load the extension in Chrome by:');
  console.log('   1. Go to chrome://extensions/');
  console.log('   2. Enable "Developer mode"');
  console.log('   3. Click "Load unpacked"');
  console.log(\`   4. Select the \${extensionDir}/ folder\`);
}

// Run if called directly
if (require.main === module) {
  buildExtension();
}

module.exports = { buildExtension };