import { toast } from "react-toastify";
import ZebraBrowserPrintWrapper from "zebra-browser-print-wrapper";
export const ZebraMultiPrint = async (content: any) => {
  try {
    for (const item of content) {
      const zpl = `${item}`;
      const browserPrint = new ZebraBrowserPrintWrapper();
      const defaultPrinter = await browserPrint.getDefaultPrinter();
      browserPrint.setPrinter(defaultPrinter);
      const printerStatus = await browserPrint.checkPrinterStatus();
      if (printerStatus.isReadyToPrint) {
        browserPrint.print(zpl);
      } else {
        toast.error(printerStatus.errors);
      }
    }
  } catch (error) {
    toast.error("Error Printing Labels");
  }
};
