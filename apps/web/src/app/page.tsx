"use client";

import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Download,
  RefreshCcw,
  ArrowRight,
  Printer,
  Zap,
  Droplet,
  FileCheck,
} from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<number[]>([120]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setProcessedUrl(null);
  };

  const processImage = async () => {
    if (!file) return;
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", file);
    const apiUrl = `https://localhost:5000/api/document/process?threshold=${threshold[0]}`;

    try {
      const response = await fetch(apiUrl, { method: "POST", body: formData });
      if (!response.ok) throw new Error("Processing failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setProcessedUrl(url);
    } catch (error) {
      console.error(error);
      alert("Connection Error: Is the backend running on port 5000?");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    if (!processedUrl) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print.");
      return;
    }

    const img = printWindow.document.createElement("img");
    img.src = processedUrl;
    img.style.maxWidth = "100%";
    img.style.height = "auto";

    printWindow.document.body.style.cssText =
      "margin:0; display:flex; justify-content:center; align-items:center; height:100vh;";

    img.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 100);
    };

    printWindow.document.body.appendChild(img);
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setProcessedUrl(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      <header className="bg-zinc-950 text-white pt-24 pb-40 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_800px_at_50%_-100px,#3b82f6,transparent)]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]"></div>

        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-8">
          <Badge
            variant="outline"
            className="px-4 py-1.5 rounded-full text-sm font-medium border-zinc-700 bg-zinc-900/50 text-zinc-300 backdrop-blur-md"
          >
            v1.0 • Free Document Tool
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            InkSaver
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Stop printing grey shadows. Our intelligent algorithm{" "}
            <span className="text-zinc-200 font-medium">binarizes</span>{" "}
            documents, removing noise to save ink and improve readability.
          </p>

          <div className="flex flex-wrap justify-center gap-6 pt-2 text-sm font-medium text-zinc-500">
            <div
              className="flex items-center gap-2"
              title="Optimized for printers"
            >
              <Droplet className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span>Save Ink/Toner</span>
            </div>
            <div className="flex items-center gap-2" title="Fast processing">
              <Zap className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>Instant Processing</span>
            </div>
            <div
              className="flex items-center gap-2"
              title="Printer optimized output"
            >
              <Printer className="w-4 h-4 text-teal-400" aria-hidden="true" />
              <span>Printer Optimized</span>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN APP INTERFACE --- */}
      <main className="flex-1 px-4 md:px-6 -mt-24 relative z-20 pb-20">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-2xl shadow-zinc-900/10 border-zinc-200/80 bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
            <CardContent className="p-6 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                {/* LEFT: INPUT SECTION */}
                <section aria-label="Upload Section" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-2 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-sm border">
                        1
                      </span>
                      Upload
                    </h2>
                    <p className="text-zinc-500 text-sm">
                      Upload a photo of notes, receipts, or book pages
                      (JPG/PNG).
                    </p>
                  </div>

                  {!file ? (
                    <FileUpload onFileSelect={onFileSelect} />
                  ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {/* Image Preview */}
                      <div className="relative rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50/50 aspect-4/3 flex items-center justify-center group shadow-inner">
                        <img
                          src={previewUrl!}
                          alt="Document Preview"
                          className="max-h-full max-w-full object-contain p-4 shadow-sm"
                        />
                        <div className="absolute inset-0 bg-zinc-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
                          <Button
                            variant="secondary"
                            onClick={reset}
                            className="bg-white hover:bg-zinc-100 text-zinc-900 cursor-pointer"
                          >
                            <RefreshCcw className="h-4 w-4 mr-2" />
                            Change File
                          </Button>
                        </div>
                      </div>

                      {/* Controls Panel */}
                      <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200/60 space-y-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <label
                              htmlFor="threshold-slider"
                              className="font-semibold text-sm text-zinc-700"
                            >
                              Threshold Sensitivity
                            </label>
                            <span className="text-xs bg-white border px-2 py-1 rounded-md text-zinc-600 font-mono shadow-sm">
                              {threshold[0]}
                            </span>
                          </div>

                          <Slider
                            id="threshold-slider"
                            value={threshold}
                            onValueChange={setThreshold}
                            max={255}
                            min={0}
                            step={1}
                            className="py-2 cursor-pointer"
                          />

                          <div className="flex justify-between text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                            <span>Cleaner (White)</span>
                            <span>Darker (Black)</span>
                          </div>
                        </div>

                        <Button
                          className="w-full h-12 text-base font-medium transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                          onClick={processImage}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Processing Document...
                            </>
                          ) : (
                            <>
                              Clean Document
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </section>

                {/* RIGHT: OUTPUT SECTION */}
                <section aria-label="Result Section" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-2 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-sm border">
                        2
                      </span>
                      Result
                    </h2>
                    <p className="text-zinc-500 text-sm">
                      Preview your print-ready document below.
                    </p>
                  </div>

                  {processedUrl ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/10 p-4 shadow-sm relative group">
                        <div className="absolute inset-0 bg-[radial-gradient(#10b98115_1px,transparent_1px)] bg-size-[16px_16px] -z-10"></div>
                        <img
                          src={processedUrl}
                          alt="Processed Clean Document"
                          className="w-full h-auto rounded-lg shadow-md bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          variant="outline"
                          className="h-12 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 cursor-pointer"
                          onClick={handlePrint}
                        >
                          <Printer className="mr-2 h-4 w-4" />
                          Print
                        </Button>
                        <a
                          href={processedUrl}
                          download="inksaver-clean.jpg"
                          className="w-full"
                        >
                          <Button className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 cursor-pointer">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </a>
                      </div>

                      <div className="bg-emerald-50/50 border border-emerald-100 text-emerald-800 text-sm p-4 rounded-lg flex items-start gap-3">
                        <FileCheck className="h-5 w-5 shrink-0 mt-0.5 text-emerald-600" />
                        <p>
                          <strong>Success!</strong> Shadows removed. This image
                          is optimized for black & white printing.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[420px] border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center text-zinc-400 p-8 text-center bg-zinc-50/30 hover:bg-zinc-50/50 transition-colors">
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center mb-6">
                        <Zap className="h-8 w-8 text-zinc-300" />
                      </div>
                      <h3 className="font-semibold text-lg text-zinc-700">
                        Waiting for Magic
                      </h3>
                      <p className="max-w-60 mt-2 text-sm text-zinc-500">
                        Upload a file on the left and hit "Clean Document" to
                        see the B&W conversion.
                      </p>
                    </div>
                  )}
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-8 text-center text-zinc-400 text-sm border-t border-zinc-100">
        <p>
          Built with ❤️ by{" "}
          <a
            href="https://github.com/Abhi1264"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-zinc-900 font-medium underline decoration-zinc-300 underline-offset-4 transition-colors"
          >
            Abhinav Kumar Choudhary
          </a>
        </p>
      </footer>
    </div>
  );
}
