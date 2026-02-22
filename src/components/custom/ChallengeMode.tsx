import { useState } from 'react';
import { Target, CheckCircle, XCircle, Lightbulb, Play, RotateCcw, Trophy, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { challenges, getChallengesByDifficulty } from '@/data/examples';
import type { Challenge, ExecutionResult } from '@/types';

interface ChallengeModeProps {
  onComplete: (challenge: Challenge) => void;
  onRunCode: (code: string) => Promise<ExecutionResult>;
  isPyodideReady: boolean;
}

export function ChallengeMode({ onComplete, onRunCode, isPyodideReady }: ChallengeModeProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [userCode, setUserCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filteredChallenges = difficulty === 'all' 
    ? challenges 
    : getChallengesByDifficulty(difficulty);

  const handleSelectChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setUserCode(challenge.brokenCode);
    setShowHint(false);
    setResult(null);
  };

  const handleRun = async () => {
    if (!userCode || !isPyodideReady) return;
    
    setIsRunning(true);
    setResult(null);
    
    try {
      const execResult = await onRunCode(userCode);
      setResult(execResult);
      
      // Check if output matches expected
      if (!execResult.error && execResult.output.trim() === selectedChallenge?.expectedOutput.trim()) {
        if (selectedChallenge && !completedChallenges.has(selectedChallenge.id)) {
          setCompletedChallenges(prev => new Set([...prev, selectedChallenge.id]));
          onComplete(selectedChallenge);
        }
      }
    } catch (error) {
      setResult({
        output: '',
        error: error instanceof Error ? error.message : 'Execution failed',
        executionTime: 0
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    if (selectedChallenge) {
      setUserCode(selectedChallenge.brokenCode);
      setResult(null);
      setShowHint(false);
    }
  };

  const isSuccess = result && !result.error && 
    selectedChallenge && 
    result.output.trim() === selectedChallenge.expectedOutput.trim();

  // Challenge list view
  if (!selectedChallenge) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Challenge Mode
              </h2>
              <p className="text-muted-foreground mt-1">
                Fix broken code to earn XP and level up!
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter:</span>
              {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
                <Button
                  key={diff}
                  variant={difficulty === diff ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDifficulty(diff)}
                  className="text-xs capitalize"
                >
                  {diff}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {filteredChallenges.map((challenge) => {
              const isCompleted = completedChallenges.has(challenge.id);
              
              return (
                <Card 
                  key={challenge.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isCompleted ? 'border-green-500/50 bg-green-50/50' : ''
                  }`}
                  onClick={() => handleSelectChallenge(challenge)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={
                            challenge.difficulty === 'easy' ? 'default' :
                            challenge.difficulty === 'medium' ? 'secondary' : 'destructive'
                          }>
                            {challenge.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            {challenge.xpReward} XP
                          </span>
                          {isCompleted && (
                            <Badge variant="outline" className="border-green-500 text-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {challenge.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Challenge detail view
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="sm" onClick={() => setSelectedChallenge(null)}>
            ← Back to Challenges
          </Button>
          
          <div className="flex items-center gap-4">
            <Badge variant={
              selectedChallenge.difficulty === 'easy' ? 'default' :
              selectedChallenge.difficulty === 'medium' ? 'secondary' : 'destructive'
            }>
              {selectedChallenge.difficulty}
            </Badge>
            <span className="text-sm flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              {selectedChallenge.xpReward} XP
            </span>
          </div>
        </div>

        {/* Challenge Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{selectedChallenge.title}</CardTitle>
            <CardDescription>{selectedChallenge.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Expected Output:</p>
                <pre className="bg-secondary/50 p-3 rounded-lg text-sm font-mono">
                  {selectedChallenge.expectedOutput}
                </pre>
              </div>
              
              {showHint && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <span className="font-medium">Hint:</span> {selectedChallenge.hint}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Code Editor */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Fix the Code</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHint(!showHint)}
              >
                <Lightbulb className="w-4 h-4 mr-1" />
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full h-48 p-4 font-mono text-sm bg-secondary/30 rounded-lg border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              spellCheck={false}
            />
            
            <div className="flex items-center justify-between mt-4">
              <Button
                onClick={handleRun}
                disabled={!isPyodideReady || isRunning}
                className="gap-2"
              >
                <Play className="w-4 h-4" />
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
              
              {isSuccess && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Challenge Complete!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <Card className={result.error ? 'border-red-200' : isSuccess ? 'border-green-200' : ''}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {result.error ? (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    Error
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Success!
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5 text-yellow-500" />
                    Output
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className={`p-4 rounded-lg font-mono text-sm ${
                result.error ? 'bg-red-50 text-red-700' : 
                isSuccess ? 'bg-green-50 text-green-700' : 
                'bg-secondary/50'
              }`}>
                {result.error || result.output || '(No output)'}
              </pre>
              
              {!isSuccess && !result.error && (
                <p className="text-sm text-muted-foreground mt-2">
                  Output does not match expected result. Keep trying!
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
