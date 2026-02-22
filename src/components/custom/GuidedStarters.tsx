import { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { guidedStarters, conceptInfoMap, conceptOrder } from '@/data/examples';
import type { ConceptLevel } from '@/types';

interface GuidedStartersProps {
  onSelect: (text: string) => void;
}

/**
 * Compact concept picker — shown above the textarea when it's empty.
 * Two views: concept grid → template list. Clicking a template fills the textarea.
 */
export function GuidedStarters({ onSelect }: GuidedStartersProps) {
  const [selectedConcept, setSelectedConcept] = useState<ConceptLevel | null>(null);

  const selectedStarter = selectedConcept
    ? guidedStarters.find((s) => s.concept === selectedConcept)
    : null;

  // ── Concept grid ────────────────────────────────────────────────────
  if (!selectedConcept) {
    return (
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <p className="text-xs font-medium text-muted-foreground">
            What do you want to do? Pick one, or just type below.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {conceptOrder.map((id) => {
            const info = conceptInfoMap[id];
            return (
              <button
                key={id}
                onClick={() => setSelectedConcept(id)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border
                           bg-card hover:bg-secondary/60 hover:border-primary/40
                           transition-all text-left group"
              >
                <span className="text-sm flex-shrink-0">{info.icon}</span>
                <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">
                  {info.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Template list for chosen concept ────────────────────────────────
  const info = conceptInfoMap[selectedConcept];

  return (
    <div className="px-4 py-3">
      <button
        onClick={() => setSelectedConcept(null)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground
                   transition-colors mb-2"
      >
        <ArrowLeft className="w-3 h-3" />
        Back
      </button>

      <p className="text-xs font-medium text-muted-foreground mb-2">
        {info.icon} {info.label} — click a template:
      </p>

      <div className="grid grid-cols-1 gap-1.5">
        {selectedStarter?.templates.map((tpl, i) => (
          <button
            key={i}
            onClick={() => {
              onSelect(tpl.placeholder);
              setSelectedConcept(null);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border
                       bg-card/50 hover:bg-secondary/60 hover:border-primary/40
                       transition-all text-left group"
          >
            <span className="text-xs text-muted-foreground/70 group-hover:text-primary/70 transition-colors font-mono truncate">
              → {tpl.placeholder}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}