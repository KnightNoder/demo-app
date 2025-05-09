import React, { useEffect, useRef, useState } from "react";
import { ModalInfo } from "../../../types";

interface IframeModalProps {
  modal: ModalInfo;
  closeModal: () => void;
}

const IframeModal: React.FC<IframeModalProps> = ({ modal, closeModal }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 10; // Try up to 10 times

  // Function to hide the cancel button in the iframe with improved Windows compatibility
  const hideCancelButton = () => {
    try {
      const iframe = iframeRef.current;

      if (!iframe) {
        console.log("Iframe reference not available");
        return false;
      }

      // Handle cross-browser issues - use try/catch for each potential access method
      let iframeDoc = null;

      try {
        // First attempt - standard approach
        iframeDoc = iframe.contentDocument;
      } catch (e) {
        console.log("Standard contentDocument access failed:", e);
      }

      if (!iframeDoc) {
        try {
          // Second attempt - different property (works in some browsers)
          iframeDoc = iframe.contentWindow?.document;
        } catch (e) {
          console.log("contentWindow.document access failed:", e);
        }
      }

      if (!iframeDoc) {
        console.log(
          "Cannot access iframe content yet (attempt " +
            (retryCount + 1) +
            "/" +
            maxRetries +
            ")"
        );

        // Increment retry counter if we still can't access
        if (retryCount < maxRetries) {
          setRetryCount((prev) => prev + 1);
          // Schedule another attempt with exponential backoff (50ms, 100ms, 200ms, etc.)
          setTimeout(hideCancelButton, 50 * Math.pow(2, retryCount));
        } else {
          console.log("Max retries reached, giving up on hiding cancel button");
        }

        return false;
      }

      // Target the specific cancel button with multiple possible selectors
      // Split into multiple individual queries to avoid invalid selector syntax
      let cancelButton = null;

      try {
        // Try the specific button first - most common case
        cancelButton = iframeDoc.querySelector(
          'input[type="button"][value="Cancel"]'
        );

        // If not found, try other valid selectors one by one
        if (!cancelButton) {
          cancelButton = iframeDoc.querySelector(".cancel-button");
        }

        if (!cancelButton) {
          cancelButton = iframeDoc.querySelector('button[value="Cancel"]');
        }

        // Try common button text approaches - look for text content
        if (!cancelButton) {
          const buttons = iframeDoc.querySelectorAll("button");
          for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            if (button.textContent && button.textContent.trim() === "Cancel") {
              cancelButton = button;
              break;
            }
          }
        }

        // Try by ID or name attributes - one by one
        if (!cancelButton) {
          cancelButton = iframeDoc.querySelector("#cancelBtn");
        }

        if (!cancelButton) {
          cancelButton = iframeDoc.querySelector('[name="cancel"]');
        }

        if (!cancelButton) {
          cancelButton = iframeDoc.querySelector('[id*="cancel"]');
        }

        if (!cancelButton) {
          cancelButton = iframeDoc.querySelector('[name*="cancel"]');
        }
      } catch (e) {
        console.error("Error selecting cancel button:", e);
        return false;
      }

      if (cancelButton) {
        try {
          (cancelButton as HTMLElement).style.display = "none";
          console.log("Cancel button hidden successfully");
          return true;
        } catch (e) {
          console.error("Error hiding cancel button:", e);
          return false;
        }
      } else {
        console.log("Cancel button not found in iframe");

        // If button not found, try injecting CSS to hide it by selector patterns
        try {
          const style = iframeDoc.createElement("style");
          // Use only standard CSS selectors
          style.textContent = `
            input[type="button"][value="Cancel"] { 
              display: none !important;
            }
            .cancel-button {
              display: none !important;
            }
            button[value="Cancel"] {
              display: none !important;
            }
            #cancelBtn {
              display: none !important;
            }
            [name="cancel"] {
              display: none !important;
            }
            [id*="cancel"] {
              display: none !important;
            }
            [name*="cancel"] {
              display: none !important;
            }
          `;
          iframeDoc.head.appendChild(style);
          console.log("Injected CSS to hide cancel button");
          return true;
        } catch (e) {
          console.error("Error injecting CSS:", e);
          return false;
        }
      }
    } catch (error) {
      console.error("Error in hideCancelButton:", error);
      return false;
    }
  };

  // Handle communication from the iframe
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      // Check for close message from iframe
      if (event.data && event.data.action === "closeModal") {
        // Call the closeModal function passed as prop
        closeModal();

        // Also dispatch a specific iframe modal closed event
        const iframeEvent = new CustomEvent("iframeModalClosed", {});
        document.dispatchEvent(iframeEvent);

        // Dispatch the standard modal state change event
        const modalEvent = new CustomEvent("modalStateChange", {
          detail: { isOpen: false },
        });
        document.dispatchEvent(modalEvent);
      }
    };

    // Add the event listener for iframe messages
    window.addEventListener("message", handleIframeMessage);

    // Cleanup
    return () => {
      window.removeEventListener("message", handleIframeMessage);
    };
  }, [closeModal]);

  // Set up listeners to hide the cancel button when iframe loads
  useEffect(() => {
    // Reset retry count when URL changes
    setRetryCount(0);

    const iframe = iframeRef.current;
    if (!iframe) return;

    // Create multi-step approach for hiding button
    const attemptHidingButton = () => {
      // First try immediately
      setTimeout(hideCancelButton, 50);

      // Then try on iframe load
      iframe.addEventListener("load", handleLoad);
    };

    // Try to hide the button when the iframe loads
    const handleLoad = () => {
      // First attempt - immediate
      setTimeout(() => {
        if (!hideCancelButton()) {
          // Second attempt - after a longer delay for slower Windows browsers
          setTimeout(hideCancelButton, 300);

          // Third attempt - after an even longer delay
          setTimeout(hideCancelButton, 800);

          // Additional attempts spaced out
          setTimeout(hideCancelButton, 1500);
          setTimeout(hideCancelButton, 3000);
        }
      }, 50);

      // Set up a MutationObserver to handle dynamically loaded content
      try {
        const setupObserver = () => {
          // Try different ways to access the document
          let iframeDoc = null;
          try {
            iframeDoc = iframe.contentDocument;
          } catch (e) {}
          if (!iframeDoc)
            try {
              iframeDoc = iframe.contentWindow?.document;
            } catch (e) {}

          if (iframeDoc && iframeDoc.body) {
            const observer = new MutationObserver(() => {
              // Don't pass the entire mutation record as it might be huge
              hideCancelButton();
            });

            observer.observe(iframeDoc.body, {
              childList: true,
              subtree: true,
            });

            return observer;
          }
          return null;
        };

        let observer = setupObserver();

        // If observer setup failed, try again after a delay
        if (!observer) {
          setTimeout(() => {
            observer = setupObserver();
          }, 1000);
        }

        // Return cleanup function
        return () => {
          if (observer) observer.disconnect();
        };
      } catch (error) {
        console.error("Error setting up mutation observer:", error);
      }
    };

    // Start the process of hiding the button
    attemptHidingButton();

    // Cleanup
    return () => {
      iframe.removeEventListener("load", handleLoad);
    };
  }, [modal.url]); // Dependency on modal.url ensures this runs when the iframe src changes

  // Fixed height with flex to ensure the iframe fills the container
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {modal.url && (
        <iframe
          ref={iframeRef}
          src={modal.url}
          className="w-full h-full border-0"
          title={modal.title}
          // sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation allow-top-navigation-by-user-activation"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={() => {
            // Additional onLoad handler with retry mechanism
            setTimeout(hideCancelButton, 100);
            setTimeout(hideCancelButton, 500);
            setTimeout(hideCancelButton, 1000);
          }}
        />
      )}
    </div>
  );
};

export default IframeModal;