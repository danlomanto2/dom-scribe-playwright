// Injected script that runs in the page context to access shadow DOMs
(function() {
  'use strict';
  
  // Listen for scan requests from content script
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    
    if (event.data.type === 'SCAN_SHADOW_DOMS') {
      const shadowElements = scanAllShadowDOMs();
      window.postMessage({
        type: 'SHADOW_DOM_RESULTS',
        elements: shadowElements
      }, '*');
    }
  });
  
  function scanAllShadowDOMs() {
    const shadowElements: any[] = [];
    
    function findAndScanShadowRoots(root: Document | Element = document) {
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT
      );
      
      let node;
      while (node = walker.nextNode()) {
        const element = node as Element;
        
        if (element.shadowRoot) {
          // Scan elements in this shadow root
          element.shadowRoot.querySelectorAll('*').forEach(shadowEl => {
            if (isInteractiveElement(shadowEl)) {
              shadowElements.push(createElementData(shadowEl, 'shadow'));
            }
          });
          
          // Recursively scan for nested shadow roots
          findAndScanShadowRoots(element.shadowRoot as any);
        }
      }
    }
    
    function isInteractiveElement(element: Element): boolean {
      const tagName = element.tagName.toLowerCase();
      const interactiveTags = ['button', 'input', 'select', 'textarea', 'a', 'form'];
      
      return interactiveTags.includes(tagName) ||
             element.hasAttribute('role') ||
             element.hasAttribute('data-testid') ||
             element.hasAttribute('aria-label') ||
             element.getAttribute('role') === 'button' ||
             element.getAttribute('tabindex') !== null ||
             !!(element as any).onclick;
    }
    
    function createElementData(element: Element, context: string) {
      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);
      
      return {
        tagName: element.tagName.toLowerCase(),
        id: element.id,
        className: element.className,
        textContent: element.textContent?.trim().substring(0, 100),
        role: element.getAttribute('role'),
        ariaLabel: element.getAttribute('aria-label'),
        dataTestId: element.getAttribute('data-testid'),
        placeholder: element.getAttribute('placeholder'),
        type: element.getAttribute('type'),
        href: element.getAttribute('href'),
        name: element.getAttribute('name'),
        context,
        isVisible: rect.width > 0 && rect.height > 0 && 
                   computedStyle.visibility !== 'hidden' &&
                   computedStyle.display !== 'none',
        position: { 
          x: rect.x, 
          y: rect.y, 
          width: rect.width, 
          height: rect.height 
        },
        shadowHost: (element.getRootNode() as any).host?.tagName || null
      };
    }
    
    findAndScanShadowRoots();
    return shadowElements;
  }
  
  // Signal that the script is ready
  window.postMessage({ type: 'INJECTED_SCRIPT_READY' }, '*');
})();