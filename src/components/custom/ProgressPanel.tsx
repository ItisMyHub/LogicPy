import { Trophy, Star, Target, Zap, BookOpen, Lock, Unlock, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { UserProgress, Feature } from '@/types';

interface ProgressPanelProps {
  progress: {
    progress: UserProgress;
    getProgressPercentage: () => number;
    getUnlockedFeaturesInfo: () => { feature: Feature; level: number; description: string }[];
    getNextUnlock: () => { feature: Feature; level: number; description: string } | null;
    resetProgress: () => void;
  };
  onClose: () => void;
}

const featureIcons: Record<Feature, typeof Trophy> = {
  'basic-translation': BookOpen,
  'code-editing': Star,
  'challenges': Target,
  'export': Zap,
  'advanced-patterns': Star,
  'custom-functions': Trophy
};

export function ProgressPanel({ progress, onClose }: ProgressPanelProps) {
  const { 
    progress: userProgress, 
    getProgressPercentage, 
    getUnlockedFeaturesInfo,
    getNextUnlock,
    resetProgress 
  } = progress;
  
  const progressPercent = getProgressPercentage();
  const unlockedFeatures = getUnlockedFeaturesInfo();
  const nextUnlock = getNextUnlock();

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Your Progress
          </h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            Back to Editor
          </Button>
        </div>

        {/* Level Card */}
        <Card className="mb-6 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {userProgress.level}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Level</p>
                  <p className="text-2xl font-bold">Level {userProgress.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total XP</p>
                <p className="text-2xl font-bold text-primary">
                  {userProgress.xp + (userProgress.level - 1) * 100}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Level {userProgress.level + 1}</span>
                <span className="text-muted-foreground">
                  {userProgress.xp} / {userProgress.xpToNextLevel} XP
                </span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{userProgress.streakDays}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{userProgress.completedExamples.length}</p>
              <p className="text-xs text-muted-foreground">Examples Done</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{userProgress.completedChallenges.length}</p>
              <p className="text-xs text-muted-foreground">Challenges Won</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Unlock className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{userProgress.unlockedFeatures.length}</p>
              <p className="text-xs text-muted-foreground">Features Unlocked</p>
            </CardContent>
          </Card>
        </div>

        {/* Unlocked Features */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Unlock className="w-5 h-5 text-green-500" />
              Unlocked Features
            </CardTitle>
            <CardDescription>
              Features you have access to
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {unlockedFeatures.map((feature) => {
                const Icon = featureIcons[feature.feature];
                return (
                  <div 
                    key={feature.feature}
                    className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200"
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-green-900">{feature.description}</p>
                      <p className="text-xs text-green-700">Unlocked at Level {feature.level}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Next Unlock */}
        {nextUnlock && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-muted-foreground" />
                Next Unlock
              </CardTitle>
              <CardDescription>
                Reach Level {nextUnlock.level} to unlock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted border border-border">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Star className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{nextUnlock.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Unlocks at Level {nextUnlock.level}
                  </p>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  Locked
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* How to Earn XP */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How to Earn XP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span>Try an example</span>
                </div>
                <Badge>+5 XP</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-purple-500" />
                  <span>Complete an easy challenge</span>
                </div>
                <Badge>+10-15 XP</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-orange-500" />
                  <span>Complete a medium challenge</span>
                </div>
                <Badge>+20-25 XP</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-red-500" />
                  <span>Complete a hard challenge</span>
                </div>
                <Badge>+40-50 XP</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reset Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Reset all your progress (cannot be undone)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              onClick={() => {
                resetProgress();
                toast.success('Progress reset!');
              }}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All Progress
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
