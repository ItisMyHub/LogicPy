import { useRef } from 'react';
import { Lightbulb} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { GuidedStarters } from '@/components/custom/GuidedStarters';

interface LogicInputProps {
  value: string;
  onChange: (value: string) => void;
  onTranslate: () => void;
  isTranslating: boolean;
 }

export function LogicInput({
  value,
  onChange,
  onTranslate,
  isTranslating,
}: LogicInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onTranslate();
    }
  };

  const handleStarterSelect = (text: string) => {
    onChange(text);
    // Focus textarea and place cursor at end
    setTimeout(() => {
      textareaRef.current?.focus();
      const len = text.length;
      textareaRef.current?.setSelectionRange(len, len);
    }, 50);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Compact header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-violet-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Describe What You Want</h2>
            <p className="text-xs text-muted-foreground">Plain English → Python</p>
          </div>
        </div>
      </div>

      {/* Guided starters — shown only when textarea is empty */}
      {!value.trim() && (
        <div className="border-b border-border bg-card/30 overflow-auto max-h-[45%]">
          <GuidedStarters onSelect={handleStarterSelect} />
        </div>
      )}

      {/* Textarea — ALWAYS visible */}
      <div className="flex-1 p-3 min-h-0">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value ? '' : 'Type what you want your code to do...\n\nExamples:\nprint Hello World\nset score to 100\nif age is greater than 18 print You can vote'}
          className="w-full h-full resize-none border border-dashed border-muted focus:border-primary/50
                     rounded-xl text-sm leading-relaxed p-4
                     placeholder:text-muted-foreground/50 font-light"
          spellCheck={false}
        />
      </div>

      {/* Translate button — compact */}
      <div className="px-3 pb-3">
        <Button
          onClick={onTranslate}
          disabled={!value.trim() || isTranslating}
          className="w-full h-10 text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600
                     hover:brightness-105 transition-all"
        >
          {isTranslating ? (
            <>Translating…</>
          ) : (
            <>✨ Translate to Python</>
          )}
        </Button>
        <p className="text-center text-[10px] text-muted-foreground mt-1.5">
          Ctrl+Enter to translate
        </p>
      </div>
    </div>
  );
}