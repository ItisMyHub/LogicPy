import { Brain, Play, Github, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { UserProgress } from '@/types';

interface HeaderProps {
  onRun: () => void;
  canRun: boolean;
  isRunning: boolean;
  progress: {
    progress: UserProgress;
    getProgressPercentage: () => number;
  };
  currentView: string;
}

export function Header({
  onRun,
  canRun,
  isRunning,
  progress,
  currentView
}: HeaderProps) {
  const { progress: userProgress, getProgressPercentage } = progress;
  const progressPercent = getProgressPercentage();

  return (
    <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-lg shadow-primary/20">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold gradient-text">LogicPy</h1>
          <p className="text-[10px] text-muted-foreground leading-none">Logic-First Python Translator</p>
        </div>
      </div>

      {/* Center - Progress (hidden on small screens) */}
      <div className="hidden md:flex items-center gap-3">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-xs font-medium">Lv. {userProgress.level}</span>
          </div>
          <div className="w-20">
            <Progress value={progressPercent} className="h-1.5" />
          </div>
          <span className="text-[10px] text-muted-foreground">{userProgress.xp}/{userProgress.xpToNextLevel} XP</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary/50">
          <Zap className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-xs">{userProgress.streakDays}d streak</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {currentView === 'translate' && (
          <Button
            size="sm"
            onClick={onRun}
            disabled={!canRun || isRunning}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 h-8"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-pulse' : ''}`} />
            {isRunning ? 'Running…' : 'Run Code'}
          </Button>
        )}

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex"
        >
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Github className="w-4 h-4" />
          </Button>
        </a>
      </div>
    </header>
  );
}