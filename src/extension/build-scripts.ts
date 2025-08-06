// Build configuration for Chrome extension
// This file contains the build process for converting React components to extension files

export const buildConfig = {
  entry: {
    popup: './src/extension/popup.tsx',
    'content-script': './src/extension/content-script.ts',
    'injected-script': './src/extension/injected-script.ts'
  },
  output: {
    path: './public',
    filename: '[name].js'
  },
  externals: {
    'chrome': 'chrome'
  }
};

// Build instructions for the extension
export const buildInstructions = `
To build this Chrome extension:

1. Install dependencies:
   npm install

2. Build the extension:
   npm run build:extension

3. Load in Chrome:
   - Open Chrome and go to chrome://extensions/
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the 'public' folder

4. Use the extension:
   - Click the extension icon in the toolbar
   - Set your OpenAI API key
   - Navigate to any webpage
   - Click "Scan DOM" to analyze the page
   - Add an optional prompt to filter results
   - Click "Generate POM" to create Playwright code
   - Copy or download the generated code

Extension Features:
- Scans all DOM elements including shadow DOM and iframes
- Generates clean, DRY TypeScript Page Object Models
- Uses best practices for Playwright locators
- Supports user prompts for targeted generation
- Includes proper error handling and user feedback
`;

// Package.json script to add:
export const packageJsonScript = {
  "build:extension": "vite build --mode extension"
};