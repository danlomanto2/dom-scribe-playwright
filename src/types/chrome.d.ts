// Chrome extension types for content scripts and popup
declare namespace chrome {
  namespace tabs {
    interface Tab {
      id?: number;
      url?: string;
      title?: string;
    }
    
    function query(queryInfo: { active: boolean; currentWindow: boolean }): Promise<Tab[]>;
  }
  
  namespace scripting {
    interface InjectionTarget {
      tabId: number;
    }
    
    interface ScriptInjection {
      target: InjectionTarget;
      func: () => any;
    }
    
    interface InjectionResult {
      result: any;
    }
    
    function executeScript(injection: ScriptInjection): Promise<InjectionResult[]>;
  }
  
  namespace storage {
    namespace sync {
      function get(keys: string[], callback: (result: Record<string, any>) => void): void;
      function set(items: Record<string, any>, callback?: () => void): void;
    }
  }
  
  namespace runtime {
    interface MessageSender {
      tab?: Tab;
    }
    
    const onMessage: {
      addListener(callback: (request: any, sender: MessageSender, sendResponse: (response?: any) => void) => boolean | void): void;
    };
    
    function getURL(path: string): string;
  }
}