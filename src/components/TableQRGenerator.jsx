// src/components/TableQRGenerator.jsx
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import QRCode from "qrcode";


export default function TableQRGenerator() {
  const [baseUrl, setBaseUrl] = useState("https://qrodering.vercel.app/");
  const [numTables, setNumTables] = useState("");
  const [qrCodes, setQrCodes] = useState([]);

  const handleGenerate = () => {
    const count = parseInt(numTables);
    if (!baseUrl.trim() || isNaN(count) || count <= 0) {
      alert("Please enter a valid base URL and number of tables");
      return;
    }
    const urls = Array.from({ length: count }, (_, i) => `${baseUrl}?table=${i + 1}`);
    setQrCodes(urls);
  };

  const handleDownload = async (index) => {
    const url = qrCodes[index];
    const canvas = document.createElement("canvas");
    await QRCode.toCanvas(canvas, url, { width: 300 });
    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `table-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = async () => {
    if (qrCodes.length === 0) return;
    const zip = new JSZip();
    for (let i = 0; i < qrCodes.length; i++) {
      const canvas = document.createElement("canvas");
      await QRCode.toCanvas(canvas, qrCodes[i], { width: 300 });
      const pngUrl = canvas.toDataURL("image/png");
      const imgData = pngUrl.split(",")[1];
      zip.file(`table-${i + 1}.png`, imgData, { base64: true });
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "table_qr_codes.zip");
  };

  const handlePrintAll = () => {
    const printWindow = window.open("", "_blank");
    const qrHTML = qrCodes
      .map(
        (url, i) => `
        <div style="display:inline-block;text-align:center;margin:20px;">
          <img src="${document.getElementById(`qr-${i}`).toDataURL("image/png")}" width="150" height="150"/>
          <p style="font-weight:bold;">Table ${i + 1}</p>
        </div>`
      )
      .join("");
    printWindow.document.write(`
      <html>
        <head><title>Print QR Codes</title></head>
        <body style="text-align:center;font-family:sans-serif;">
          <h2>Restaurant Table QR Codes</h2>
          ${qrHTML}
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">🍽️ Table QR Generator</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter base URL (e.g. https://qrodering.vercel.app/)"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
          />
          <input
            type="number"
            placeholder="Enter number of tables"
            value={numTables}
            onChange={(e) => setNumTables(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
          />
          <button
            onClick={handleGenerate}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-3 rounded-xl shadow-lg transition transform hover:scale-[1.02]"
          >
            Generate QR Codes
          </button>
        </div>

        {qrCodes.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Generated QR Codes</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadAll}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm shadow"
                >
                  Download All (ZIP)
                </button>
                <button
                  onClick={handlePrintAll}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm shadow"
                >
                  Print All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center">
              {qrCodes.map((url, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-2xl shadow-md p-4 flex flex-col items-center w-full max-w-[180px]"
                >
                  <QRCodeCanvas id={`qr-${index}`} value={url} size={110} />
                  <p className="mt-2 text-sm text-gray-700 font-medium">Table {index + 1}</p>
                  <button
                    onClick={() => handleDownload(index)}
                    className="mt-1 text-indigo-600 hover:underline text-sm"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
