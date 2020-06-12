/**
 * Helper function that opens a popup and calls onClose when needed.
 */
const openPopup = ({ url, title, onClose, width = 600, height = 600 }) => {
  if (!url) {
    throw new Error("URL is empty");
  }

  const popup = window.open(
    url,
    title,
    "toolbar=no,location=no,status=no,menubar=no," +
      `scrollbars=yes,resizable=yes,width=${width},height=${height},` +
      "left=100,top=100",
    onClose // This is forwarded for unit testing.
  );

  // The listener that will be triggered on postMessage
  const listener = (e) => {
    if (typeof e.data.success !== "undefined") {
      // Show the status for longer for better UX
      setTimeout(() => {
        popup.close();
        if (typeof onClose === "function") {
          onClose(e.data);
        }
      }, 1000);

      window.removeEventListener("message", listener);
    }
  };

  window.addEventListener("message", listener);

  return popup;
};

export default openPopup;
