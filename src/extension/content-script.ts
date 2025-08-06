// Content script for DOM scanning and communication with popup
console.log("Playwright POM Generator content script loaded");

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scanDOM") {
    try {
      const domData = scanPageDOM();
      sendResponse({ success: true, data: domData });
    } catch (error) {
      console.error("Error scanning DOM:", error);
      sendResponse({ success: false, error: error.message });
    }
  }
  return true; // Keep message channel open
});

function scanPageDOM() {
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
    const href = element.getAttribute("href");
    const name = element.getAttribute("name");
    
    // Get position and visibility info
    const rect = element.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0 && 
                     window.getComputedStyle(element).visibility !== 'hidden' &&
                     window.getComputedStyle(element).display !== 'none';
    
    // Skip if no useful identifying information
    if (!id && !className && !role && !ariaLabel && !dataTestId && 
        !placeholder && !type && !textContent && !href && !name) {
      return;
    }
    
    // Skip script and style elements
    if (tagName === 'script' || tagName === 'style' || tagName === 'meta' || 
        tagName === 'link' || tagName === 'title') {
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
      href,
      name,
      context,
      isVisible,
      position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      selectors: generateSelectors(element)
    });
  }
  
  function generateSelectors(element: Element): string[] {
    const selectors = [];
    
    // Prioritize data-testid
    if (element.getAttribute("data-testid")) {
      selectors.push(`[data-testid="${element.getAttribute("data-testid")}"]`);
    }
    
    // ID selector
    if (element.id) {
      selectors.push(`#${element.id}`);
    }
    
    // Role-based selectors
    if (element.getAttribute("role")) {
      const role = element.getAttribute("role");
      const name = element.getAttribute("aria-label") || element.textContent?.trim();
      if (name && name.length < 50) {
        selectors.push(`[role="${role}"][aria-label="${name}"]`);
      } else {
        selectors.push(`[role="${role}"]`);
      }
    }
    
    // Aria-label selector
    if (element.getAttribute("aria-label")) {
      selectors.push(`[aria-label="${element.getAttribute("aria-label")}"]`);
    }
    
    // Input-specific selectors
    if (element.tagName.toLowerCase() === "input") {
      if (element.getAttribute("name")) {
        selectors.push(`input[name="${element.getAttribute("name")}"]`);
      }
      if (element.getAttribute("type")) {
        selectors.push(`input[type="${element.getAttribute("type")}"]`);
      }
      if (element.getAttribute("placeholder")) {
        selectors.push(`input[placeholder="${element.getAttribute("placeholder")}"]`);
      }
    }
    
    // Text-based selector for buttons and links
    if ((element.tagName.toLowerCase() === "button" || 
         element.tagName.toLowerCase() === "a") && 
        element.textContent && element.textContent.trim().length < 50) {
      selectors.push(`${element.tagName.toLowerCase()}:has-text("${element.textContent.trim()}")`);
    }
    
    // Class-based selector (simplified, only use stable-looking classes)
    if (element.className && typeof element.className === "string") {
      const classes = element.className.split(" ")
        .filter(c => c.length > 0 && !c.includes("-") && c.length > 3);
      if (classes.length > 0) {
        selectors.push(`.${classes[0]}`);
      }
    }
    
    // CSS selector as fallback
    selectors.push(getCSSSelector(element));
    
    return selectors;
  }
  
  function getCSSSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`;
    }
    
    const path = [];
    let current = element;
    
    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let selector = current.tagName.toLowerCase();
      
      if (current.id) {
        selector += `#${current.id}`;
        path.unshift(selector);
        break;
      }
      
      let sibling = current;
      let nth = 1;
      while (sibling.previousElementSibling) {
        sibling = sibling.previousElementSibling;
        if (sibling.tagName === current.tagName) {
          nth++;
        }
      }
      
      if (nth > 1) {
        selector += `:nth-of-type(${nth})`;
      }
      
      path.unshift(selector);
      current = current.parentElement;
      
      // Don't go too deep
      if (path.length > 5) break;
    }
    
    return path.join(" > ");
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
  
  return { 
    elements: elements.filter(el => el.isVisible), // Only return visible elements
    totalElements: elements.length,
    url: window.location.href,
    timestamp: Date.now()
  };
}

// Inject the scanning script into the page context to access shadow DOMs
function injectScanningScript() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected-script.js');
  (document.head || document.documentElement).appendChild(script);
}

// Inject on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectScanningScript);
} else {
  injectScanningScript();
}