import { toast } from "react-toastify";
import ZebraBrowserPrintWrapper from "zebra-browser-print-wrapper";

const printBarcode = async (content: any) => {
  try {
    const zpl = `${content}`;
    const browserPrint = new ZebraBrowserPrintWrapper();
    const defaultPrinter = await browserPrint.getDefaultPrinter();
    browserPrint.setPrinter(defaultPrinter);
    const printerStatus = await browserPrint.checkPrinterStatus();
    if (printerStatus.isReadyToPrint) {
      browserPrint.print(zpl);
    } else {
      toast.error(printerStatus.errors);
    }
  } catch (error) {
    toast.error("Error Printing Labels");
  }
};

export default printBarcode;
