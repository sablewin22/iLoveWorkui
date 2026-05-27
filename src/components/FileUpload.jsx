import { useRef, useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import mammoth from "mammoth";

export default function FileUpload({ onFileContent }) {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setExtracting(true);

    const ext = file.name.split(".").pop().toLowerCase();

    try {
      if (ext === "pdf") {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();
        const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          let lastY = null;
          let line = "";
          for (const item of content.items) {
            const y = Math.round(item.transform[5]);
            if (lastY !== null && Math.abs(y - lastY) > 3) {
              text += line.trimEnd() + "\n";
              line = "";
            }
            line += item.str + " ";
            lastY = y;
          }
          text += line.trimEnd() + "\n";
        }
        onFileContent(text);
        setExtracting(false);
      } else if (ext === "docx") {
        const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        onFileContent(result.value);
        setExtracting(false);
      }
    } catch (err) {
      onFileContent(null, file.name);
      setExtracting(false);
      console.error("File extraction error:", err);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (inputRef.current) inputRef.current.value = "";
    if (fileName && file) {
      setFileName(null);
      onFileContent("");
    }
    if (file) handleFile(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? "border-accent bg-accent/5"
            : "border-black/10 hover:border-black/20 hover:bg-black/[0.02]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleChange}
          className="hidden"
          aria-label="Selecionar arquivo"
        />

        {extracting ? (
          <div className="flex items-center justify-center gap-2 text-light/80">
            <Loader2 className="w-5 h-5 animate-spin text-accent" />
            <span className="text-sm">Extraindo texto...</span>
          </div>
        ) : fileName ? (
          <div className="flex items-center justify-center gap-2 text-light/80">
            <FileText className="w-5 h-5 text-accent" />
            <span className="text-sm">{fileName}</span>
          </div>
        ) : (
          <div>
            <Upload className="w-8 h-8 mx-auto mb-3 text-light/40" />
            <p className="text-light/60 text-sm">
              Arraste um arquivo aqui ou clique para selecionar
            </p>
            <p className="text-light/30 text-xs mt-1">PDF ou DOCX</p>
          </div>
        )}
      </div>
    </div>
  );
}
