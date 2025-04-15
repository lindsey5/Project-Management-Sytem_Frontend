import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState, useRef } from "react";

const QrCodeScanner = () => {
    const [scanResult, setScanResult] = useState(null);

    const onScanSuccess = (decodedText, decodedResult) => {
        setScanResult(decodedResult);
    };

    const onScanFailure = (error) => {
        console.warn(`Code scan error = ${error}`);
    };

    useEffect(() => {
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
            showTorchButtonIfSupported: true,
            showZoomSliderIfSupported: true,
        };

        const html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            config,
            false
        );

        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    }, []);

    return (
        <div className="scanner-container">
            <div id="reader" style={{ width: '100%' }}></div>
            {scanResult && (
                <div className="scan-result">
                    <p>Scanned: {scanResult.decodedText}</p>
                    <button onClick={() => setScanResult(null)}>Scan Again</button>
                </div>
            )}
        </div>
    );
};

export default QrCodeScanner;