import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { Header } from '@/components/custom/Header';
import { LogicInput } from '@/components/custom/LogicInput';
import { PythonOutput } from '@/components/custom/PythonOutput';
import { Terminal } from '@/components/custom/Terminal';
import { ChallengeMode } from '@/components/custom/ChallengeMode';
import { SettingsPanel } from '@/components/custom/SettingsPanel';
import { ProgressPanel } from '@/components/custom/ProgressPanel';
import { translateLogicToPython } from '@/services/translationService';
import { initPyodide, executePython, retryLoadPyodide } from '@/services/pyodideService';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Toaster, toast } from 'sonner';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useSettings } from '@/hooks/useSettings';
import { downloadPythonFile, copyToClipboard } from '@/utils/export';
import type { TranslationResponse, ExecutionResult, Challenge } from '@/types';
import { Zap, GraduationCap, Trophy, Settings, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

// View modes
type ViewMode = 'translate' | 'challenges' | 'settings' | 'progress';

function App() {
  // State
  const [logicInput, setLogicInput] = useState('');
  const [translation, setTranslation] = useState<TranslationResponse | null>(null);
  const [editedCode, setEditedCode] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideStatus, setPyodideStatus] = useState('Not started');
  const [hasTranslated, setHasTranslated] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('translate');

  // Hooks
  const progress = useUserProgress();
  const settings = useSettings();

  // Initialize Pyodide on mount
  useEffect(() => {
    const init = async () => {
      setPyodideStatus('Loading...');
      try {
        await initPyodide();
        setPyodideStatus('Ready');
        toast.success('Python interpreter ready!', {
          description: 'You can now run Python code in your browser.',
          duration: 3000
        });
      } catch (error) {
        setPyodideStatus('Error');
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        toast.error('Failed to load Python interpreter', {
          description: `${errorMsg}. Click to retry.`,
          duration: 5000,
          action: {
            label: 'Retry',
            onClick: async () => {
              setPyodideStatus('Retrying...');
              try {
                await retryLoadPyodide();
                setPyodideStatus('Ready');
                toast.success('Python interpreter loaded!');
              } catch {
                toast.error('Still failed to load');
                setPyodideStatus('Error');
              }
            }
          }
        });
      }
    };
    init();
  }, []);

  // Update streak on activity
  useEffect(() => {
    progress.updateStreak();
  }, []);

  // Handle translation
  const handleTranslate = useCallback(async () => {
    if (!logicInput.trim()) return;

    setIsTranslating(true);
    setExecutionResult(null);

    try {
      const result = await translateLogicToPython(logicInput, settings.settings.aiConfig);
      setTranslation(result);
      setEditedCode(result.pythonCode);
      setHasTranslated(true);

      
      
      toast.success('Translation complete!', {
        description: `Translated using Local Engine.`,
        duration: 2000
      });
    } catch (error) {
      toast.error('Translation failed', {
        description: 'Please try again with different wording.',
        duration: 3000
      });
    } finally {
      setIsTranslating(false);
    }
  }, [logicInput, settings]);

  // Handle code execution
  const handleRun = useCallback(async () => {
    const codeToRun = editedCode || translation?.pythonCode;
    if (!codeToRun) return;

    setIsRunning(true);
    setExecutionResult(null);

    try {
      const result = await executePython(codeToRun);
      setExecutionResult(result);

      if (result.error) {
        toast.error('Execution error', {
          description: 'Check the terminal for details.',
          duration: 3000
        });
      } else {
        toast.success('Code executed successfully!', {
          description: `Output: ${result.output.slice(0, 50)}${result.output.length > 50 ? '...' : ''}`,
          duration: 2000
        });
      }
    } catch (error) {
      toast.error('Failed to execute code', {
        description: 'Please try again.',
        duration: 3000
      });
    } finally {
      setIsRunning(false);
    }
  }, [editedCode, translation]);

 
  // Handle challenge completion
  const handleChallengeComplete = useCallback((challenge: Challenge) => {
    progress.completeChallenge(challenge);
    toast.success('Challenge completed!', {
      description: `+${challenge.xpReward} XP earned!`,
      duration: 3000
    });
  }, [progress]);

  // Handle code edit
  const handleCodeChange = useCallback((code: string) => {
    setEditedCode(code);
  }, []);

  // Export code
  const handleExport = useCallback(() => {
    const code = editedCode || translation?.pythonCode;
    if (!code) {
      toast.error('No code to export');
      return;
    }

    downloadPythonFile(code, {
      filename: 'logicpy_script.py',
      includeComments: true,
      includeTimestamp: true
    });

    toast.success('Code exported!', {
      description: 'Downloaded as logicpy_script.py',
      duration: 2000
    });
  }, [editedCode, translation]);

  // Copy code
  const handleCopy = useCallback(async () => {
    const code = editedCode || translation?.pythonCode;
    if (!code) {
      toast.error('No code to copy');
      return;
    }

    const success = await copyToClipboard(code);
    if (success) {
      toast.success('Code copied to clipboard!');
    } else {
      toast.error('Failed to copy code');
    }
  }, [editedCode, translation]);

  // Render main content based on view mode
  const renderMainContent = () => {
    switch (viewMode) {
      case 'challenges':
        return (
          <ChallengeMode
            onComplete={handleChallengeComplete}
            onRunCode={executePython}
            isPyodideReady={pyodideStatus === 'Ready'}
          />
        );

      case 'settings':
        return (
          <SettingsPanel
            settings={settings}
            onClose={() => setViewMode('translate')}
          />
        );

      case 'progress':
        return (
          <ProgressPanel
            progress={progress}
            onClose={() => setViewMode('translate')}
          />
        );

             case 'translate':
      default:
        return (
          <>
            {/* Welcome Banner (shown before first translation) */}
            {!hasTranslated && (
              <div className="px-6 py-3 border-b border-border bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-foreground">Welcome to LogicPy!</h2>
                    <p className="text-xs text-muted-foreground truncate">
                      Describe what you want in plain English → we translate it to Python and teach you how it works.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Main editor area: 2 columns on top, terminal on bottom */}
            {/* @ts-ignore */}
            <ResizablePanelGroup direction="vertical" className="flex-1">
              {/* Top half: Input + Output side by side */}
              <ResizablePanel defaultSize={50} minSize={30}>
                {/* @ts-ignore */}
                <ResizablePanelGroup direction="horizontal" className="h-full">
                  {/* Logic Input Panel */}
                  <ResizablePanel defaultSize={50} minSize={30}>
                    <div className="h-full border-r border-border overflow-auto">
                      <LogicInput
                        value={logicInput}
                        onChange={setLogicInput}
                        onTranslate={handleTranslate}
                        isTranslating={isTranslating}
                                           />
                    </div>
                  </ResizablePanel>

                  <ResizableHandle withHandle />

                  {/* Python Output Panel */}
                  <ResizablePanel defaultSize={50} minSize={30}>
                    <div className="h-full overflow-auto">
                      <PythonOutput
                        translation={translation}
                        editedCode={editedCode}
                        originalLogic={logicInput}
                        onCodeChange={handleCodeChange}
                        onAutoFix={() => {
                          if (translation?.pythonCode) {
                            setEditedCode(translation.pythonCode);
                            toast.success('Code auto-corrected to valid Python!', { description: 'See "What changed" below' });
                          }
                        }}
                        onExport={progress.isFeatureUnlocked('export') ? handleExport : undefined}
                        onCopy={handleCopy}
                      />
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Bottom: Terminal full-width */}
              <ResizablePanel defaultSize={40} minSize={15}>
                <Terminal
                  result={executionResult}
                  isRunning={isRunning}
                  onRun={handleRun}
                  hasCode={!!(editedCode || translation?.pythonCode)}
                  pyodideStatus={pyodideStatus}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster position="top-right" richColors />

      <Header
        onRun={handleRun}
        canRun={!!(editedCode || translation?.pythonCode)}
        isRunning={isRunning}
        progress={progress}
        currentView={viewMode}
      />

      {/* Navigation Tabs */}
      <div className="px-6 py-2 border-b border-border bg-card/50 flex items-center gap-2">
        <Button
          variant={viewMode === 'translate' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('translate')}
          className="gap-2"
        >
          <Zap className="w-4 h-4" />
          Translate
        </Button>

        <Button
          variant={viewMode === 'challenges' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('challenges')}
          disabled={!progress.isFeatureUnlocked('challenges')}
          className="gap-2"
        >
          <Target className="w-4 h-4" />
          Challenges
          {!progress.isFeatureUnlocked('challenges') && (
            <span className="text-xs opacity-50">(Lv. 3)</span>
          )}
        </Button>

        <Button
          variant={viewMode === 'progress' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('progress')}
          className="gap-2"
        >
          <Trophy className="w-4 h-4" />
          Progress
        </Button>

        <Button
          variant={viewMode === 'settings' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('settings')}
          className="gap-2 ml-auto"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderMainContent()}
      </main>

      {/* Footer */}
      <footer className="px-4 py-1.5 border-t border-border bg-card/30 text-xs text-muted-foreground flex items-center justify-between">
  <span>LogicPy v1.0 — Learn Python by thinking, not memorizing syntax</span>
  <span className="flex items-center gap-1.5">
    <span className={`w-2 h-2 rounded-full ${
      pyodideStatus === 'Ready' ? 'bg-green-500' :
      pyodideStatus === 'Error' ? 'bg-red-500' :
      'bg-yellow-500 animate-pulse'
    }`} />
    Python {pyodideStatus === 'Ready' ? 'Ready' : pyodideStatus}
  </span>
</footer>
    </div>
  );
}

export default App;