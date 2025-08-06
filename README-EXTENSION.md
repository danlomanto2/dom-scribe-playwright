# Playwright POM Generator Chrome Extension

A Chrome extension that scans any webpage's DOM (including iframes & shadow DOMs) and uses ChatGPT to auto-generate Playwright Page Object Model code.

## Features

- **Complete DOM Scanning**: Scans all DOM elements including iframes and shadow DOMs
- **AI-Powered Generation**: Uses ChatGPT to generate clean, DRY Page Object Models
- **Smart Locators**: Generates reliable locators using data-testid, aria-labels, and best practices
- **User Prompts**: Supports custom prompts to filter what gets generated
- **TypeScript Ready**: Generates production-ready TypeScript code

## Setup Instructions

### 1. Build the Extension

```bash
# Install dependencies
npm install

# Build the extension files
npm run build:extension
```

### 2. Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist-extension` folder

### 3. Configure API Key

1. Click the extension icon in Chrome toolbar
2. Enter your OpenAI API key in the settings
3. Click "Save" to store the key

## How to Use

1. **Navigate** to any webpage you want to analyze
2. **Click** the extension icon to open the popup
3. **Scan DOM** - Click to analyze the current page structure
4. **Add Prompt** (optional) - Specify what you want generated:
   - "only the login form"
   - "navigation menu elements"
   - "modal dialog components"
5. **Generate POM** - Click to create the Page Object Model
6. **Copy/Download** - Use the generated TypeScript code in your project

## Generated Code Features

The extension generates Page Object Models with:

- **Proper TypeScript structure** with class-based organization
- **Reliable locators** prioritizing data-testid, id, and aria-label
- **Encapsulated methods** for common workflows (login, search, etc.)
- **JSDoc comments** for complex functionality
- **Error handling** in action methods
- **DRY principles** to avoid code duplication

## Example Generated Code

```typescript
export class LoginPage {
  constructor(private page: Page) {}

  // Locators
  get emailInput() { return this.page.locator('[data-testid="email-input"]'); }
  get passwordInput() { return this.page.locator('[data-testid="password-input"]'); }
  get loginButton() { return this.page.locator('[data-testid="login-button"]'); }

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

## Extension Architecture

### Files Structure

- `manifest.json` - Extension configuration
- `popup.html` - Extension popup interface  
- `content-script.js` - DOM scanning logic
- `injected-script.js` - Shadow DOM access
- `popup.js` - React-based UI component

### DOM Scanning Process

1. **Main DOM**: Scans all elements in the main document
2. **Shadow DOM**: Accesses shadow roots using injected scripts
3. **iFrames**: Attempts to scan iframe contents (when CORS allows)
4. **Filtering**: Only captures interactive and identifiable elements
5. **Locator Generation**: Creates multiple selector options per element

### API Integration

The extension integrates with OpenAI's GPT-4 API to:
- Analyze scanned DOM structure
- Generate appropriate Page Object Model code
- Follow Playwright best practices
- Create encapsulated functionality methods

## Customization

### Modify DOM Scanning

Edit `src/extension/content-script.ts` to:
- Add new element attributes to capture
- Modify filtering criteria
- Change locator generation strategy

### Customize Generated Code

Edit the system prompt in `src/extension/popup.tsx` to:
- Change code structure patterns
- Add different locator strategies
- Include additional utility methods

### Styling

The extension uses a dark theme optimized for developers. Modify `src/index.css` to change:
- Color scheme
- Typography
- Component styling

## Troubleshooting

### Extension Not Loading
- Ensure all files are built correctly
- Check Chrome developer console for errors
- Verify manifest.json is valid

### DOM Scanning Issues
- Some sites may block content scripts
- Cross-origin iframes cannot be accessed
- Shadow DOM access requires script injection

### API Errors
- Verify OpenAI API key is correct
- Check API quota and billing status
- Ensure network connectivity

## Development

To modify and rebuild:

```bash
# Make changes to source files
# Then rebuild
npm run build:extension

# Reload extension in Chrome
# Go to chrome://extensions/ and click reload
```

## Security Notes

- API keys are stored locally in Chrome storage
- Extension only accesses current tab when activated
- Generated code should be reviewed before use
- No data is transmitted except to OpenAI API

## Support

For issues or feature requests, please refer to the project documentation or create an issue in the repository.