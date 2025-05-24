import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState, useRef, useContext } from "react";
import { createRequest } from "../../../services/RequestService";
import { toast } from "react-toastify";
import { SignalContext } from "../../../context/signalContext";

const QrCodeScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const scannerRef = useRef(null);
    const { sendRequestNotification } = useContext(SignalContext)

    const onScanSuccess = async (decodedText) => {
        const response = await createRequest(decodedText)
        if(response.success){
            toast.success('Done! An admin will check it out request.')
            sendRequestNotification(response.project.id);
        }
        else toast.error(response.message)

        setScanResult(decodedText)
            // Stop scanner after successful scan
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear scanner: ", error);
                });
            }
    };

    const onScanFailure = (error) => {
    };

    useEffect(() => {
      const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
      };
  
      scannerRef.current = new Html5QrcodeScanner("reader", config, false);
      scannerRef.current.render(onScanSuccess, onScanFailure);
  
      return () => {
          // Stop scanning and release the camera
          scannerRef.current?.clear()
              .then(() => {
                  scannerRef.current = null; // prevent re-use
                  const videoElem = document.querySelector('#reader video');
                  if (videoElem && videoElem.srcObject) {
                      videoElem.srcObject.getTracks().forEach(track => track.stop());
                  }
              })
              .catch(error => {
                  console.error("Failed to clear scanner during unmount: ", error);
              });
      };
  }, []);

    const handleScanAgain = () => {
        setScanResult(null);
        if (scannerRef.current) {
            scannerRef.current.render(onScanSuccess, onScanFailure);
        }
    };

    return (
        <div className="scanner-container">
            <div id="reader" className="notailwind" style={{ width: '100%' }}></div>
            {scanResult && (
                <div className="scan-result flex flex-col items-center gap-3 p-5">
                    <button className="rounded-md p-2 cursor-pointer bg-black text-white notailwind" onClick={handleScanAgain}>Scan Again</button>
                </div>
            )}
        </div>
    );
};

export default QrCodeScanner;