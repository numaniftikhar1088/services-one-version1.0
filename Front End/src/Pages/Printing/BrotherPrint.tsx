import { toast } from "react-toastify";

const BrotherPrint = async (content: string | string[]) => {
  try {
    // Handle both single string and array of strings
    const contentArray = Array.isArray(content) ? content : [content];

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to print labels");
      return;
    }

    // Generate image tags for all labels
    const imageTags = contentArray
      .map((base64Content) => {
        const imageSrc = base64Content?.startsWith("data:")
          ? base64Content
          : `data:image/png;base64,${base64Content}`;
        return `<img src="${imageSrc}" alt="Label" />`;
      })
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Labels</title>
          <style>
            @page {
              size: auto;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
            img {
              display: block;
            }
          </style>
        </head>
        <body>
          ${imageTags}
        </body>
      </html>
    `);
    printWindow.document.close();

    // Wait for all images to load before printing
    const images = printWindow.document.querySelectorAll("img");
    let loadedCount = 0;
    const totalImages = images.length;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        printWindow.focus();
        printWindow.print();
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        checkAllLoaded();
      } else {
        img.addEventListener("load", checkAllLoaded);
        img.addEventListener("error", checkAllLoaded);
      }
    });
  } catch (error) {
    console.error("Brother Print Error:", error);
    toast.error("Error printing label");
  }
};

export default BrotherPrint;
