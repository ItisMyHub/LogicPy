import { useState } from 'react';
import { Flame, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { getProTips } from '@/data/examples';
import type { ConceptLevel } from '@/types';

interface ProTipPanelProps {
  concepts: ConceptLevel[];
}

/**
 * Shows ONE "How would a pro write this?" tip for the first concept.
 * Collapsed by default.
 */
export function ProTipPanel({ concepts }: ProTipPanelProps) {
  const tips = concepts.length > 0 ? getProTips(concepts[0]) : [];
  const tip = tips[0];

  if (!tip) return null;

  return <SingleProTip tip={tip} />;
}

// ── Single collapsible pro tip ────────────────────────────────────────

interface SingleProTipProps {
  tip: ReturnType<typeof getProTips>[number];
}

function SingleProTip({ tip }: SingleProTipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/50 dark:border-amber-500/30 dark:bg-amber-500/10 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-left
                   hover:bg-amber-100/50 dark:hover:bg-amber-500/20 transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <span className="text-xs font-medium text-amber-900 dark:text-amber-200">
            How would a pro write this?
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-3 pb-2.5 space-y-2.5">
          {tip.changes.map((change, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-start gap-2 text-[11px]">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-amber-600/60 dark:text-amber-400/60 mb-0.5">Before</p>
                  <code className="block bg-red-100/60 dark:bg-red-500/10 text-red-700 dark:text-red-400
                                   px-2 py-1 rounded font-mono text-[11px] whitespace-pre-wrap">{change.from}</code>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 mt-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-amber-600/60 dark:text-amber-400/60 mb-0.5">After</p>
                  <code className="block bg-green-100/60 dark:bg-green-500/10 text-green-700 dark:text-green-400
                                   px-2 py-1 rounded font-mono text-[11px] whitespace-pre-wrap">{change.to}</code>
                </div>
              </div>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
                💡 {change.reason}
              </p>
            </div>
          ))}

          <div className="mt-1.5">
            <p className="text-[10px] uppercase tracking-wider text-amber-600/60 dark:text-amber-400/60 mb-1">Full pro version</p>
            <pre className="bg-gray-900 text-green-400 px-2.5 py-2 rounded-lg text-[11px] font-mono
                            overflow-x-auto leading-relaxed">{tip.proCode}</pre>
          </div>
        </div>
      )}
    </div>
  );
}