# Playwright POM Generator Chrome Extension

A Chrome extension that scans any webpage's DOM (including iframes & shadow DOMs) and uses ChatGPT to auto-generate Playwright Page Object Model code in TypeScript.

## Features

- **Complete DOM Scanning**: Analyzes all DOM elements including iframes and shadow DOMs
- **AI-Powered Generation**: Uses OpenAI GPT-4 to generate clean, DRY Page Object Models
- **Smart Locators**: Prioritizes data-testid, aria-labels, and other reliable selectors
- **Custom Prompts**: Filter generation with prompts like "only the login modal"
- **TypeScript Ready**: Generates production-ready code with proper types
- **Copy & Download**: Easy code export for immediate use

## Installation Instructions

### Option 1: Download Pre-built Extension (Recommended)

1. **Download from Releases**:
   - Go to the [Releases page](../../releases) of this repository
   - Download the latest `playwright-pom-generator-extension.zip`
   - Extract the ZIP file to a folder on your computer

2. **Install in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the extracted extension folder
   - The extension will appear in your Chrome toolbar

### Option 2: Build from Source

1. **Download the Repository**:
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   npm install
   ```

2. **The extension builds automatically via GitHub Actions**:
   - Every commit triggers an automated build
   - Built extensions are available in the Actions artifacts
   - Releases are created automatically on main branch pushes

3. **Manual Build** (if needed):
   ```bash
   npm run build
   # Extension files will be in the dist folder
   ```

### Step 3: Configure Your OpenAI API Key

1. **Get an OpenAI API Key**:
   - Visit [OpenAI API](https://platform.openai.com/api-keys)
   - Create a new API key

2. **Set up the Extension**:
   - Click the extension icon in your Chrome toolbar
   - Enter your OpenAI API key in the settings field
   - Click "Save" to store it securely

## How to Use

### Basic Usage

1. **Navigate** to any webpage you want to analyze
2. **Click** the extension icon to open the popup
3. **Scan DOM**: Click "Scan DOM" to analyze the current page
4. **Generate POM**: Click "Generate POM" to create Page Object Model code
5. **Copy/Download**: Use the generated TypeScript code in your Playwright project

### Advanced Usage with Prompts

Add specific prompts to filter what gets generated:

- `"only the login form"` - Generates POM just for login elements
- `"navigation menu only"` - Focuses on navigation components  
- `"modal dialogs"` - Extracts modal-specific elements
- `"search functionality"` - Targets search-related elements

### Example Generated Code

```typescript
export class LoginPage {
  constructor(private page: Page) {}

  // Locators
  get emailInput() { 
    return this.page.locator('[data-testid="email-input"]'); 
  }
  
  get passwordInput() { 
    return this.page.locator('[data-testid="password-input"]'); 
  }
  
  get loginButton() { 
    return this.page.locator('[data-testid="login-button"]'); 
  }

  // Actions
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Assertions  
  async expectToBeVisible() {
    await expect(this.loginButton).toBeVisible();
  }
}
```

## Development Setup

### Project Structure

```
├── public/
│   ├── manifest.json          # Extension configuration
│   ├── popup.html            # Extension popup HTML
│   ├── popup.css             # Extension styles
│   └── icon*.png             # Extension icons
├── src/
│   ├── extension/
│   │   ├── popup.tsx         # React popup component
│   │   ├── content-script.ts # DOM scanning logic
│   │   └── injected-script.ts# Shadow DOM access
│   └── pages/
│       └── Index.tsx         # Documentation page
```

## Automated Build Process

This repository includes GitHub Actions that automatically:

### 🔄 **Continuous Integration**
- ✅ Builds the extension on every push and pull request
- ✅ Compiles React components into extension-compatible JavaScript
- ✅ Creates a ready-to-install extension package
- ✅ Runs on Ubuntu with Node.js 18

### 📦 **Automated Releases**
- 🚀 Creates releases automatically on main branch pushes
- 📁 Includes `playwright-pom-generator-extension.zip` in each release
- 📝 Generates release notes with installation instructions
- 🔖 Uses semantic versioning (v1.0.X format)

### 💾 **Build Artifacts**
- Extension files available in GitHub Actions artifacts
- Pre-built ZIP files ready for Chrome installation
- No manual build process required for end users

### 🛠 **Build Process Details**
The GitHub Action automatically:
1. Installs dependencies and builds React components
2. Creates extension directory structure
3. Bundles popup interface with simplified React components
4. Converts TypeScript to JavaScript for Chrome compatibility
5. Packages everything into a distributable ZIP file

To trigger a new build, simply push to the main branch or create a pull request.

## Troubleshooting

### Extension Won't Load
- ✅ Check that manifest.json is valid JSON
- ✅ Ensure all referenced files exist
- ✅ Look for errors in Chrome Developer Console

### DOM Scanning Issues
- ⚠️ Some websites block content scripts
- ⚠️ Cross-origin iframes cannot be accessed
- ⚠️ Shadow DOM requires script injection

### API Errors
- 🔑 Verify OpenAI API key is correct and active
- 💳 Check API usage limits and billing
- 🌐 Ensure internet connectivity

### Generated Code Issues
- 📝 Review generated locators for accuracy
- 🧪 Test selectors in browser DevTools
- ✏️ Modify prompts for better results

## Future Enhancements

- [ ] Automated build process for extension
- [ ] Support for additional AI providers
- [ ] Page Object Model templates
- [ ] Visual element highlighting
- [ ] Export to different test frameworks
- [ ] Chrome Web Store publication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the extension thoroughly
5. Submit a pull request

## License

This project is built with Lovable and uses modern web technologies including React, TypeScript, and Tailwind CSS.

## Support

For issues or feature requests:
- Check the troubleshooting section above
- Review Chrome extension development docs
- Open an issue in the repository
