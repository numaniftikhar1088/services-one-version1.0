import { toast } from "react-toastify";
export const DymoMultiPrint = async (content: any) => {
  const dymo = (window as any).dymo;
  if (!dymo?.label?.framework) {
    toast.error("DYMO SDK not loaded. Please install DYMO Connect and reload.");
    return;
  }
  // Ensure DYMO Connect SDK is available
  const framework = dymo.label.framework;
  // ✅ Properly initialize the framework
  if (framework.init && typeof framework.init === "function") {
    await new Promise<void>((resolve, reject) => {
      try {
        framework.init(
          () => resolve(),
          (err: any) => {
            console.error("DYMO init failed:", err);
            reject(err);
          }
        );
      } catch {
        resolve(); // Older SDKs don’t support callbacks
      }
    });
  }
  for (const item of content) {
    var labelXml = `${item}`;
    try {
      // ✅ Small delay to ensure printers are discovered
      await new Promise((r) => setTimeout(r, 300));
      // 🔹 Get printers list
      const printers = framework.getPrinters();
      if (!printers || printers?.length === 0) {
        toast.error("No DYMO printers found.");
        return;
      }

      const printer = printers.find((p: any) => p.isConnected);
      if (!printer) {
        toast.error("No connected DYMO printer detected.");
        return;
      }

      const printerName = printer.name;
      const modelName = printer.modelName || printer.printerType || "Unknown";

      console.log("Detected printer:", modelName);

      // 🔹 Validate label XML
      const label = framework.openLabelXml(labelXml);
      if (!label || !label.isValidLabel()) {
        toast.error("Invalid or incompatible DYMO label XML.");
        return;
      }

      // 🔹 Try rendering preview (optional)
      try {
        framework.renderLabel(labelXml, null, printerName);
      } catch (renderErr) {
        console.warn("Preview render failed:", renderErr);
      }

      // 🔹 Print the label
      try {
        const printParamsXml = '<?xml version="1.0" encoding="utf-8"?><PrintParams></PrintParams>';
        framework.printLabel(printerName, "", labelXml, "");
      } catch (err) {
        console.error("DYMO Print Error:", err);
        toast.error("Error printing label via DYMO Connect.");
      }
    } catch (error: any) {
      console.error("DYMO SDK Error:", error);

      if (error?.message?.includes("Failed to fetch") || error?.message?.includes("NetworkError")) {
        toast.error("DYMO Connect service not found. Please ensure it’s running.");
      } else {
        toast.error("Label printing failed. Check your DYMO installation.");
      }
    }
  }
};

