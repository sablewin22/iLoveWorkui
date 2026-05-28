import { useState } from "react";
import { Copy, Check, RotateCcw, FileDown } from "lucide-react";
import ReactMarkdown from "react-markdown";

function markdownToHtml(md) {
  let html = md
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^\- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(.+)$/gm, (m) => {
      if (m.startsWith("<h") || m.startsWith("<li") || m.startsWith("<ul") || m.startsWith("</ul")) return m;
      if (m.startsWith("|")) return m;
      return m;
    });
  return `<p>${html}</p>`;
}

export default function ResultBox({ content, onNewAnalysis }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPdf = () => {
    const html = markdownToHtml(content);
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>iLoveWork - Resultado</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&family=Work+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Work Sans', sans-serif;
              color: #1A1A1A;
              padding: 48px;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
            }
            h1, h2, h3, h4 { font-family: 'Raleway', sans-serif; font-weight: 600; margin-top: 24px; margin-bottom: 12px; color: #1A1A1A; }
            h1 { font-size: 24px; }
            h2 { font-size: 20px; }
            h3 { font-size: 18px; }
            h4 { font-size: 16px; }
            p { margin-bottom: 12px; color: #333; }
            ul, ol { margin-bottom: 12px; padding-left: 24px; }
            li { margin-bottom: 4px; color: #333; }
            strong { font-weight: 600; color: #1A1A1A; }
            @media print {
              body { padding: 24px; }
            }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="card-surface animate-fadeIn">
      <div className="result-content">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="font-title font-bold text-3xl text-light mt-8 mb-4 leading-tight">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="font-title font-bold text-2xl text-accent mt-8 mb-4 leading-snug border-b border-accent/20 pb-2">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="font-sub font-semibold text-lg text-accent/90 mt-5 mb-2">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="font-title font-semibold text-base text-accent mt-4 mb-1.5">
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className="text-light/85 text-base leading-relaxed mb-3">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-none text-light/85 text-base space-y-1 mb-4">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-none text-light/85 text-base space-y-1 mb-4">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed mb-1.5 pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-accent before:font-bold [&>ul]:ml-4 [&>ul]:mt-2 [&>ul]:mb-2 [&>ul]:border-l-2 [&>ul]:border-accent/10 [&>ul]:pl-3 [&>ol]:ml-4 [&>ol]:mt-2 [&>ol]:mb-2 [&>ol]:border-l-2 [&>ol]:border-accent/10 [&>ol]:pl-3 [&>ul>li]:before:content-['◦'] [&>ol>li]:before:content-['◦'] [&>ul>li]:pl-4 [&>ol>li]:pl-4">
                {children}
              </li>
            ),
            strong: ({ children }) => (
              <strong className="text-accent font-semibold">{children}</strong>
            ),
            code: ({ children }) => (
              <code className="bg-black/5 px-2 py-0.5 rounded text-sm text-accent">
                {children}
              </code>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-black/5">
        <button onClick={handleCopy} className="btn-ghost flex items-center gap-2 text-sm">
          {copied ? (
            <><Check className="w-4 h-4 text-green-600" /> Copiado!</>
          ) : (
            <><Copy className="w-4 h-4" /> Copiar resultado</>
          )}
        </button>
        <button onClick={handleDownloadPdf} className="btn-ghost flex items-center gap-2 text-sm">
          <FileDown className="w-4 h-4" /> Baixar como PDF
        </button>
        <button onClick={onNewAnalysis} className="btn-ghost flex items-center gap-2 text-sm">
          <RotateCcw className="w-4 h-4" /> Nova análise
        </button>
      </div>
    </div>
  );
}
