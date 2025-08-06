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

### Step 1: Download the Repository

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
```

### Step 2: Build the Extension

Currently, the extension files are ready in the `/public` and `/src/extension` folders. To prepare for Chrome installation:

1. **Copy extension files to a build folder**:
   ```bash
   mkdir chrome-extension
   cp public/manifest.json chrome-extension/
   cp public/popup.html chrome-extension/
   cp public/popup.css chrome-extension/
   cp public/icon*.png chrome-extension/
   ```

2. **Build the React components** (this will be automated in future versions):
   - The popup interface needs to be compiled from the React components
   - Content scripts are ready to use as-is

### Step 3: Install in Chrome

1. **Open Chrome Extensions page**:
   - Navigate to `chrome://extensions/`
   - Or go to Chrome menu → More tools → Extensions

2. **Enable Developer Mode**:
   - Toggle "Developer mode" in the top right corner

3. **Load the Extension**:
   - Click "Load unpacked"
   - Select the `chrome-extension` folder you created in Step 2
   - The extension should now appear in your extensions list

4. **Pin the Extension** (optional):
   - Click the puzzle piece icon in Chrome toolbar
   - Find "Playwright POM Generator" and click the pin icon

### Step 4: Configure Your OpenAI API Key

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

### Building for Development

1. **Make changes** to source files
2. **Rebuild extension** (process to be automated)
3. **Reload in Chrome**:
   - Go to `chrome://extensions/`
   - Click the reload button on your extension

### Customization

**Modify DOM Scanning**: Edit `src/extension/content-script.ts` to change:
- Element filtering criteria
- Locator generation strategies
- Data extraction methods

**Customize AI Prompts**: Edit `src/extension/popup.tsx` to modify:
- System prompts for code generation
- Page Object Model templates
- Locator prioritization

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
