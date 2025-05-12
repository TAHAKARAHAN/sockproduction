"use client";
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Html5QrcodeScanType, Html5QrcodeError } from "html5-qrcode/esm/core";

interface QrScannerProps {
  onScanSuccess: (decodedText: string, decodedResult: any) => void;
  onScanFailure?: (error: string) => void;
  scannerHeight?: number;
  scannerWidth?: number;
}

export default function QrScanner({
  onScanSuccess,
  onScanFailure,
  scannerHeight = 400,
  scannerWidth = 600,
}: QrScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerDivId = "qr-reader";

  useEffect(() => {
    const isBrowserSupportAvailable =
      typeof window !== "undefined" &&
      navigator?.mediaDevices !== undefined &&
      typeof navigator.mediaDevices.getUserMedia === "function";

    if (!isBrowserSupportAvailable) {
      setError("QR tarayıcı bu cihazda desteklenmiyor.");
      return;
    }

    scannerRef.current = new Html5Qrcode(scannerDivId);

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current
          .stop()
          .catch((err) =>
            console.error("QR tarayıcı durdurulurken hata oluştu:", err)
          );
      }
    };
  }, []);

  const startScanning = () => {
    if (!scannerRef.current) return;

    const qrCodeSuccessCallback = (decodedText: string, decodedResult: any) => {
      onScanSuccess(decodedText, decodedResult);
      setIsScanning(false);
      stopScanning();
    };

    const qrCodeErrorCallback = (
      errorMessage: string,
      exception?: any
    ) => {
      if (onScanFailure) {
        onScanFailure(errorMessage);
      }
    };

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      formatsToSupport: [
        0, // QR_CODE
        3, // EAN_13
        4, // EAN_8
        5, // UPC_A
        6, // UPC_E
        7, // UPC_EAN_EXTENSION
        8, // CODE_39
        9, // CODE_93
        10, // CODE_128
        11, // CODABAR
        12, // ITF
      ],
      supportedScanTypes: [
        Html5QrcodeScanType.SCAN_TYPE_CAMERA,
        Html5QrcodeScanType.SCAN_TYPE_FILE,
      ],
    };

    scannerRef.current
      .start(
        { facingMode: "environment" },
        config,
        qrCodeSuccessCallback,
        qrCodeErrorCallback
      )
      .then(() => {
        setIsScanning(true);
        setError(null);
      })
      .catch((err) => {
        setError(`Tarayıcı başlatılırken hata: ${err}`);
      });
  };

  const stopScanning = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current
        .stop()
        .then(() => {
          setIsScanning(false);
        })
        .catch((err) => {
          console.error("QR tarayıcı durdurulurken hata:", err);
        });
    }
  };

  return (
    <div className="qr-scanner-container">
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
          {error}
        </div>
      )}

      <div
        id={scannerDivId}
        style={{ width: scannerWidth, height: scannerHeight }}
        className="mx-auto border rounded-lg overflow-hidden mb-4"
      ></div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex justify-center space-x-4">
          {!isScanning ? (
            <button
              onClick={startScanning}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              QR ve Barkod Tara
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
            >
              Taramayı Durdur
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          QR kodlar ve barkodlar (EAN, UPC, Code 39, Code 128 vb.) desteklenmektedir.
        </p>
      </div>
    </div>
  );
}
