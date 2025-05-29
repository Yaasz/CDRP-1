import { useEffect } from "react";
import { Languages } from "lucide-react";

const GoogleTranslateButton = () => {
  useEffect(() => {
    // Clear any existing Google Translate cookies on component mount
    const clearGoogleTranslateCookies = () => {
      const cookies = ['googtrans', 'googtrans_'];
      cookies.forEach(cookie => {
        document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
        document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
    };

    // Load Google Translate script
    const addScript = document.createElement("script");
    addScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    addScript.async = true;
    document.body.appendChild(addScript);

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    // More aggressive hiding function
    const hideGoogleElements = () => {
      // Hide all possible Google Translate elements
      const elementsToHide = [
        "iframe.goog-te-banner-frame",
        ".goog-te-banner-frame",
        "#goog-gt-tt",
        ".goog-te-balloon-frame",
        ".goog-te-spinner-pos",
        ".goog-te-ftab-frame",
        ".goog-te-menu-frame",
        ".skiptranslate",
        "[class*='goog-te']",
        ".goog-te-gadget",
        ".goog-te-combo",
        "[id*=':1.container']",
        "[id*='google_translate_element']"
      ];

      elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (element && element !== document.getElementById("google_translate_element")) {
            element.style.display = "none !important";
            element.style.visibility = "hidden !important";
            element.style.opacity = "0 !important";
            element.style.height = "0px !important";
            element.style.overflow = "hidden !important";
          }
        });
      });

      // Force remove the top spacing
      document.body.style.top = "0px !important";
      document.documentElement.style.top = "0px !important";
      
      // Remove any margin/padding added by Google Translate
      const html = document.documentElement;
      if (html.style.marginTop) html.style.marginTop = "0px !important";
      if (html.style.paddingTop) html.style.paddingTop = "0px !important";
    };

    // Run immediately and on intervals
    hideGoogleElements();
    const interval = setInterval(hideGoogleElements, 100);

    // MutationObserver for dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          hideGoogleElements();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeNames: ['style', 'class']
    });

    // Additional CSS injection to force hide elements
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-banner-frame,
      .goog-te-banner-frame.skiptranslate,
      #goog-gt-tt,
      .goog-te-balloon-frame,
      .goog-te-spinner-pos,
      .goog-te-ftab-frame,
      .goog-te-menu-frame,
      .skiptranslate goog-te-banner-frame,
      iframe.goog-te-banner-frame {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        max-height: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        top: -9999px !important;
        left: -9999px !important;
      }
      
      body {
        top: 0px !important;
        position: relative !important;
        margin-top: 0px !important;
        padding-top: 0px !important;
      }
      
      html {
        margin-top: 0px !important;
        padding-top: 0px !important;
      }
      
      #google_translate_element {
        display: none !important;
      }
      
      .goog-logo-link {
        display: none !important;
      }
      
      .goog-te-gadget {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      clearInterval(interval);
      observer.disconnect();
      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // Handle language selection
  const setLanguage = (lang) => {
    // Clear existing cookies first
    const clearCookies = () => {
      const cookies = ['googtrans', 'googtrans_'];
      cookies.forEach(cookie => {
        document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
        document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
    };

    clearCookies();
    
    // Set new language
    const cookieValue = `/en/${lang}`;
    document.cookie = `googtrans=${cookieValue};path=/;domain=${window.location.hostname}`;
    
    // Add a small delay before reload to ensure cookie is set
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleChange = (e) => {
    const lang = e.target.value;
    if (lang) {
      setLanguage(lang);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div id="google_translate_element" className="hidden" />

      <div className="relative flex items-center">
        <Languages className="h-4 w-4 text-gray-500 mr-2" />
        <select
          onChange={handleChange}
          defaultValue=""
          className="appearance-none bg-white border border-gray-300 text-gray-800 py-2 pl-3 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm cursor-pointer hover:border-gray-400 transition-colors google-translate-mobile"
          style={{ minWidth: '120px' }}
        >
          <option value="" disabled>
            Language
          </option>
          <option value="en">English</option>
          <option value="am">አማርኛ (Amharic)</option>
          <option value="om">Afaan Oromoo</option>
          <option value="ti">ትግርኛ (Tigrigna)</option>
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GoogleTranslateButton; 