import { useState } from "react";
import { Copy, Check, RotateCcw, FileDown, Pencil, X, ChevronDown, ChevronRight, History } from "lucide-react";
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

const MAX_ITERATIONS = 5;

export default function ResultBox({ content, onNewAnalysis, onEdit }) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editInstruction, setEditInstruction] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editHistory, setEditHistory] = useState([]);
  const [iterationCount, setIterationCount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [editError, setEditError] = useState(null);

  const handleApplyEdit = async () => {
    if (!editInstruction.trim() || !onEdit) return;
    setEditLoading(true);
    setEditError(null);
    try {
      setEditHistory(prev => [...prev, { version: iterationCount + 1, content, instruction: editInstruction }]);
      setIterationCount(prev => prev + 1);
      await onEdit(content, editInstruction);
      setEditInstruction("");
    } catch (e) {
      setEditError(e.message || "Erro ao aplicar edição");
    } finally {
      setEditLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (onNewAnalysis) onNewAnalysis();
    setEditing(false);
    setEditInstruction("");
    setEditHistory([]);
    setIterationCount(0);
    setShowHistory(false);
    setEditError(null);
  };

  const handleDismissEdit = () => {
    setEditing(false);
    setEditInstruction("");
    setEditError(null);
  };

  const handleRestoreVersion = (versionContent) => {
    onEdit(versionContent, "__RESTORE__");
    setEditing(false);
    setEditInstruction("");
    setEditError(null);
  };

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
        {!editing && (
          <button onClick={() => { setEditing(true); setEditError(null); }} className="btn-ghost flex items-center gap-2 text-sm">
            <Pencil className="w-4 h-4" /> Editar resultado
          </button>
        )}
        <button onClick={onNewAnalysis} className="btn-ghost flex items-center gap-2 text-sm">
          <RotateCcw className="w-4 h-4" /> Nova análise
        </button>
      </div>

      {editing && onEdit && (
        <div className="mt-6 pt-4 border-t border-accent/20 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-title font-semibold text-sm text-accent flex items-center gap-1.5">
              <Pencil className="w-3.5 h-3.5" /> Editar resultado
              {iterationCount > 0 && (
                <span className="text-xs text-light/50 font-normal">({iterationCount}/{MAX_ITERATIONS} edições)</span>
              )}
            </h4>
            <button onClick={handleDismissEdit} className="text-light/40 hover:text-light/70 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <textarea
            value={editInstruction}
            onChange={(e) => setEditInstruction(e.target.value)}
            placeholder="Descreva a alteração que deseja fazer..."
            rows={2}
            className="input-field resize-y text-sm"
            disabled={editLoading || iterationCount >= MAX_ITERATIONS}
          />

          {editError && (
            <p className="text-red-500 text-xs">{editError}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {iterationCount < MAX_ITERATIONS && (
              <button
                onClick={handleApplyEdit}
                disabled={!editInstruction.trim() || editLoading}
                className="btn-accent text-sm px-4 py-1.5"
              >
                {editLoading ? "Aplicando..." : "Aplicar alteração"}
              </button>
            )}
            {iterationCount < MAX_ITERATIONS && (
              <button onClick={handleRegenerate} className="btn-ghost text-sm px-4 py-1.5">
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Gerar nova versão
              </button>
            )}
            <button onClick={handleDismissEdit} className="btn-ghost text-sm px-4 py-1.5 text-green-600">
              Está ótimo ✓
            </button>
          </div>

          {iterationCount >= MAX_ITERATIONS && (
            <p className="text-amber-600 text-xs">Máximo de {MAX_ITERATIONS} edições atingido.</p>
          )}

          {editHistory.length > 0 && (
            <div className="pt-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1.5 text-xs text-light/50 hover:text-light/70 transition-colors"
              >
                {showHistory ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <History className="w-3 h-3" /> Histórico de edições ({editHistory.length})
              </button>
              {showHistory && (
                <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto">
                  {[...editHistory].reverse().map((item, idx) => (
                    <div key={item.version} className="flex items-start gap-2 p-2 rounded-lg bg-black/[0.02] border border-black/5 text-xs">
                      <span className="text-accent font-medium shrink-0 mt-0.5">#{item.version}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-light/50 truncate">{item.instruction}</p>
                      </div>
                      <button
                        onClick={() => handleRestoreVersion(item.content)}
                        className="text-accent hover:underline shrink-0 mt-0.5"
                        title="Restaurar esta versão"
                      >
                        Restaurar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
