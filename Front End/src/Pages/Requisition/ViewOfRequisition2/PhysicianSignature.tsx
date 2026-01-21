import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
const PhysicianSignature = () => {
  const signatureRef = useRef<SignatureCanvas | null>(null);
  return (
    <>
      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
        {/* ***************** 1/4 ****************** */}
        <div className="card shadow-sm mb-3 rounded mb-4">
          <div className="card-header d-flex justify-content-between align-items-center rounded">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <h6>Physician Signature</h6>
            </div>
          </div>
          <div className="card-body py-md-4 py-3">
            <div
              style={{ backgroundColor: "#F3F6F9" }}
              className="h-150px overflow-hidden rounded-3"
            >
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  className: "signature__canvas w-100 h-150px m-0",
                  width: 570,
                  height: 150,
                }}
                penColor="black"
                dotSize={2}
                velocityFilterWeight={0.7}
                clearOnResize={false}
              ></SignatureCanvas>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PhysicianSignature;
