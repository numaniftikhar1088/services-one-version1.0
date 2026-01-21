import { AxiosError, AxiosResponse } from "axios";
import React, { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import FacilityService from "../../Services/FacilityService/FacilityService";
import { TrashIcon } from "../Icons";
import useLang from "./useLanguage";


interface signPadUpload {
  imageLink?: (imageURL: string) => void;
  clearOnResize?: boolean;
}
const signPadUpload: React.FC<signPadUpload> = ({
  imageLink,
  clearOnResize = false,
}) => {
  const [imageURL, setImageURL] = useState("");
  const signCanvas = useRef<SignaturePad | null>(null);
  const { t } = useLang();
  const clear = () => {
    if (signCanvas.current) {
      signCanvas.current.clear();
    }
  };

  const generateUniqueFilename = () => {
    const timestamp = new Date().getTime();
    return `signature_${timestamp}.png`;
  };

  const handleEndSignature = () => {
    if (signCanvas.current?.isEmpty()) {
      return;
    }
    const imageBase64 = signCanvas.current!.toDataURL();
    const contentArray = new Uint8Array(
      Array.from(atob(imageBase64.split(",")[1]), (char) => char.charCodeAt(0))
    );
    const data = {
      name: generateUniqueFilename(),
      portalKey: "demo-app",
      fileType: "image/png",
      extention: "png",
      content: Array.from(contentArray),
      isPublic: true,
    };
    FacilityService.BlobUpload(JSON.stringify(data))
      .then((res: AxiosResponse) => {
        setImageURL(res.data.Data);
        if (imageLink) {
          imageLink(res.data.Data);
        }
      })
      .catch((error: AxiosError) => {});
  };

  return (
    <>
      <div style={{ backgroundColor: "#F3F6F9" }} className="h-150px">
        <SignaturePad
          ref={signCanvas}
          canvasProps={{
            className: "signature__canvas w-100 h-150px m-0",
            width: 570,
            height: 150,
          }}
          penColor="black"
          onEnd={handleEndSignature}
          dotSize={2}
          velocityFilterWeight={0.7}
          clearOnResize={clearOnResize}
        ></SignaturePad>
      </div>
      <button
        onClick={clear}
        type="button"
        className="mt-3 mb-3 btn btn-primary btn-sm px-4 mx-2 p-2"
      >
        <TrashIcon />
        {t("Clear")}
      </button>
    </>
  );
};

export default signPadUpload;
