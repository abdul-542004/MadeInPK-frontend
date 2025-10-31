
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";

  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  try {
    createRoot(rootElement).render(<App />);
  } catch (error) {
    console.error("Failed to render app:", error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: system-ui;">
        <h1 style="color: #dc2626;">App Failed to Load</h1>
        <p style="color: #666;">Check browser console for details (F12)</p>
        <pre style="background: #f3f4f6; padding: 10px; margin: 20px; text-align: left; overflow: auto;">${error}</pre>
      </div>
    `;
  }
  