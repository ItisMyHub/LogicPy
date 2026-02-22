import { useState } from 'react';
import { Brain, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { getWhyCard } from '@/data/examples';
import type { ConceptLevel } from '@/types';

interface WhyThisWorksCardProps {
  concepts: ConceptLevel[];
}

/**
 * Shows ONE "Why This Works" card for the first detected concept.
 * Collapsible — starts open.
 */
export function WhyThisWorksCard({ concepts }: WhyThisWorksCardProps) {
  // Only show card for the FIRST concept (avoid overloading the panel)
  const card = concepts.length > 0 ? getWhyCard(concepts[0]) : null;

  if (!card) return null;

  return <SingleWhyCard card={card} />;
}

// ── Single collapsible card ───────────────────────────────────────────

interface SingleWhyCardProps {
  card: NonNullable<ReturnType<typeof getWhyCard>>;
}

function SingleWhyCard({ card }: SingleWhyCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-lg border border-violet-200 bg-violet-50/50 dark:border-violet-500/30 dark:bg-violet-500/10 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-left
                   hover:bg-violet-100/50 dark:hover:bg-violet-500/20 transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 flex-shrink-0" />
          <span className="text-xs font-medium text-violet-900 dark:text-violet-200">
            {card.title}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-violet-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-violet-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-3 pb-2.5 space-y-2">
          {card.points.map((point, i) => (
            <div key={i} className="text-[11px]">
              <p className="font-medium text-violet-800 dark:text-violet-300">
                {point.question}
              </p>
              <p className="text-violet-700/80 dark:text-violet-400/80 mt-0.5 leading-relaxed">
                {point.answer}
              </p>
            </div>
          ))}

          {card.deepDiveUrl && (
            <a
              href={card.deepDiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-violet-600 dark:text-violet-400
                         hover:text-violet-800 dark:hover:text-violet-300 transition-colors mt-1"
            >
              <ExternalLink className="w-3 h-3" />
              {card.deepDiveLabel ?? 'Learn more'}
            </a>
          )}
        </div>
      )}
    </div>
  );
}