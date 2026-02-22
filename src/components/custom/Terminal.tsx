import { useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Clock, AlertTriangle, CheckCircle, Play, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ExecutionResult } from '@/types';

interface TerminalProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  onRun: () => void;
  hasCode: boolean;
  pyodideStatus: string;
}

// Common Python errors and helpful explanations
const ERROR_HELP: Record<string, string> = {
  'SyntaxError': 'Python could not understand your code. Check for missing quotes, colons, or parentheses.',
  'NameError': 'You used a variable that does not exist yet. Make sure to create it first with "set x to 5".',
  'TypeError': 'You tried to use a value in the wrong way. For example, you cannot add text and numbers directly.',
  'IndentationError': 'Your code is not indented (spaced) correctly. All lines in a block must line up.',
  'IndexError': 'You tried to access a position in a list that does not exist. Remember, counting starts at 0!',
  'KeyError': 'You tried to access a key in a dictionary that does not exist.',
  'ValueError': 'The value you used is not appropriate for what you are trying to do.',
  'ZeroDivisionError': 'You cannot divide by zero! Check your math.',
  'AttributeError': 'You tried to use a feature that does not exist for this type of data.',
  'ModuleNotFoundError': 'Python could not find the module you tried to import.',
  'RecursionError': 'A function called itself too many times. Check for infinite loops!'
};

function getErrorHelp(errorMessage: string): string | null {
  for (const [errorType, help] of Object.entries(ERROR_HELP)) {
    if (errorMessage.includes(errorType)) {
      return help;
    }
  }
  return null;
}

export function Terminal({ result, isRunning, onRun, hasCode, pyodideStatus }: TerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [result?.output, result?.error]);

  const getStatusIcon = () => {
    if (isRunning) return <div className="w-3 h-3 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />;
    if (result?.error) return <AlertTriangle className="w-3 h-3 text-red-400" />;
    if (result?.output && result.output !== '(No output)') return <CheckCircle className="w-3 h-3 text-green-400" />;
    return <div className="w-3 h-3 rounded-full bg-slate-500" />;
  };

  const getStatusText = () => {
    if (isRunning) return 'Running...';
    if (result?.error) return 'Error';
    if (result?.output && result.output !== '(No output)') return 'Success';
    return 'Ready';
  };

  const isError = pyodideStatus === 'Error';
  const isLoading = pyodideStatus === 'Loading...' || pyodideStatus === 'Retrying...';
  const errorHelp = result?.error ? getErrorHelp(result.error) : null;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-900">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-slate-100">Output</span>
          <div className="flex items-center gap-1.5 ml-3 px-2 py-0.5 rounded-full bg-slate-800">
            {getStatusIcon()}
            <span className={`text-xs ${
              result?.error ? 'text-red-400' : 
              result?.output && result.output !== '(No output)' ? 'text-green-400' : 
              'text-slate-400'
            }`}>
              {getStatusText()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {result?.executionTime && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{result.executionTime}ms</span>
            </div>
          )}
          
          <Button
            size="sm"
            onClick={onRun}
            disabled={!hasCode || isRunning || pyodideStatus !== 'Ready'}
            className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700"
          >
            <Play className="w-3 h-3 mr-1" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </div>
      </div>

      {/* Terminal Output */}
      <div 
        ref={scrollRef}
        className="flex-1 bg-slate-900 p-4 font-mono text-sm overflow-auto terminal-output"
      >
        {isLoading && (
          <div className="flex items-center gap-2 text-yellow-400 mb-4">
            <div className="w-4 h-4 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
            <span>Loading Python interpreter... This may take a moment.</span>
          </div>
        )}

        {isError && (
          <div className="flex flex-col gap-2 text-red-400 mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Failed to load Python interpreter</span>
            </div>
            <p className="text-xs text-red-300 ml-6">
              Please check your internet connection and refresh the page.
            </p>
          </div>
        )}

        {!result && !isRunning && pyodideStatus === 'Ready' && (
          <div className="text-slate-500 italic">
            <p># Click &quot;Run&quot; to execute your Python code</p>
            <p className="mt-2 text-xs"># Your output will appear here</p>
          </div>
        )}

        {isRunning && (
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
            <span>Executing...</span>
          </div>
        )}

        {result?.output && !isRunning && result.output !== '(No output)' && (
          <div className="text-green-400 whitespace-pre-wrap">
            {result.output}
          </div>
        )}

        {result?.output === '(No output)' && !result.error && !isRunning && (
          <div className="text-slate-500 italic">
            <p># Your code ran successfully but produced no output</p>
            <p className="mt-2 text-xs"># Try adding a print statement to see results</p>
          </div>
        )}

        {result?.error && !isRunning && (
          <div className="space-y-3">
            <div className="text-red-400 whitespace-pre-wrap">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-semibold">Error:</span>
              </div>
              {result.error}
            </div>
            
            {errorHelp && (
              <div className="p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-yellow-400 font-medium text-sm">What this means:</p>
                    <p className="text-yellow-300/80 text-sm mt-1">{errorHelp}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Terminal Footer */}
      <div className="px-4 py-1.5 border-t border-slate-700 bg-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Python 3.11 (Pyodide)
        </span>
        <span className={`text-xs ${
          pyodideStatus === 'Ready' ? 'text-green-400' : 
          pyodideStatus === 'Error' ? 'text-red-400' : 
          'text-yellow-400'
        }`}>
          {pyodideStatus === 'Ready' ? '● Online' : pyodideStatus === 'Error' ? '● Error' : '○ Loading...'}
        </span>
      </div>
    </div>
  );
}
