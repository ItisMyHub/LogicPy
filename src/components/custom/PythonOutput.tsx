import { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Code2, Copy, Check, Download, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';
import { WhyThisWorksCard } from '@/components/custom/WhyThisWorksCard';
import { ProTipPanel } from '@/components/custom/ProTipPanel';
import type { TranslationResponse } from '@/types';

interface PythonOutputProps {
  translation: TranslationResponse | null;
  editedCode: string;
  originalLogic: string;
  onCodeChange: (code: string) => void;
  onAutoFix: () => void;
  onExport?: () => void;
  onCopy?: () => void;
}

export function PythonOutput({
  translation,
  editedCode,
  originalLogic,
  onCodeChange,
  onAutoFix,
  onExport,
  onCopy
}: PythonOutputProps) {
  const editorRef = useRef<any>(null);
  const [copied, setCopied] = useState(false);
  const [showMappings, setShowMappings] = useState(false);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const copyCode = async () => {
    const code = editedCode || translation?.pythonCode;
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentCode = editedCode || translation?.pythonCode || '';
  const originalTranslated = translation?.pythonCode || '';
  const hasBeenEdited = currentCode !== originalTranslated && originalTranslated !== '';

  const editorOptions = {
    readOnly: false,
    minimap: { enabled: false },
    fontSize: 13,
    lineNumbers: 'on' as const,
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    padding: { top: 8 },
    fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
    fontLigatures: true,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Compact header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-green-500/20 flex items-center justify-center">
            <Code2 className="w-3.5 h-3.5 text-green-600" />
          </div>
          <h2 className="text-xs font-semibold text-foreground">Python Output</h2>
          {translation?.confidence && (
            <Badge variant={translation.confidence === 'high' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
              {translation.confidence}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onAutoFix}
            className="h-7 px-2 text-[11px] gap-1 text-green-600 border-green-200 hover:bg-green-50"
            disabled={!originalLogic}
          >
            <RefreshCw className="w-3 h-3" />
            Auto-Fix
          </Button>

          {onExport && (
            <Button variant="ghost" size="icon" onClick={onExport} className="h-7 w-7">
              <Download className="w-3.5 h-3.5" />
            </Button>
          )}

          <Button variant="ghost" size="icon" onClick={copyCode} disabled={!currentCode} className="h-7 w-7">
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>

      {/* Edit warning — compact */}
      {hasBeenEdited && (
        <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-800">
          Manually edited — click <strong>Auto-Fix</strong> to restore.
        </div>
      )}

      {/* Monaco Editor — takes the majority of space */}
      <div className="flex-1 relative min-h-0">
        {currentCode ? (
          <Editor
            height="100%"
            defaultLanguage="python"
            value={currentCode}
            onChange={(value) => onCodeChange(value || '')}
            onMount={handleEditorDidMount}
            options={editorOptions}
            theme="light"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            Translate your logic first
          </div>
        )}
      </div>

      {/* Educational section — scrollable, below editor */}
      {translation && (
        <div className="border-t border-border bg-card/30 overflow-auto max-h-56 shrink-0">
          {/* WhyThisWorks — 1 card, open */}
          {translation.concepts && translation.concepts.length > 0 && (
            <div className="px-3 pt-2.5 pb-1">
              <WhyThisWorksCard concepts={translation.concepts} />
            </div>
          )}

          {/* ProTip — 1 tip, collapsed */}
          {translation.concepts && translation.concepts.length > 0 && (
            <div className="px-3 pb-1">
              <ProTipPanel concepts={translation.concepts} />
            </div>
          )}

          {/* Mappings — collapsible */}
          {translation.mappings && translation.mappings.length > 0 && (
            <div className="px-3 pb-2.5">
              <button
                onClick={() => setShowMappings(!showMappings)}
                className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground
                           hover:text-foreground transition-colors mb-1"
              >
                {showMappings ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                What changed & why ({translation.mappings.length})
              </button>

              {showMappings && (
                <div className="space-y-1.5 max-h-32 overflow-auto">
                  {translation.mappings.map((mapping, i) => (
                    <div key={i} className="text-[11px] p-1.5 bg-secondary/30 rounded">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="bg-blue-100 text-blue-700 px-1 py-0.5 rounded text-[10px]">{mapping.logicWord}</span>
                        <span>→</span>
                        <code className="bg-green-100 text-green-700 px-1 py-0.5 rounded font-mono text-[10px]">{mapping.pythonEquivalent}</code>
                      </div>
                      <p className="text-muted-foreground mt-0.5">{mapping.explanation}</p>
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