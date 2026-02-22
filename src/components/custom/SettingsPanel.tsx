import { Settings, RotateCcw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface SettingsPanelProps {
  settings: {
    settings: {
      aiConfig: {
        provider: 'openai' | 'anthropic' | 'local';
        apiKey?: string;
        model?: string;
        enabled: boolean;
      };
      autoTranslate: boolean;
      showHints: boolean;
      soundEnabled: boolean;
    };
    setAIProvider: (provider: 'openai' | 'anthropic' | 'local') => void;
    setApiKey: (key: string) => void;
    setAIModel: (model: string) => void;
    toggleAutoTranslate: () => void;
    toggleHints: () => void;
    toggleSound: () => void;
    resetSettings: () => void;
    isAIConfigured: () => boolean;
  };
  onClose: () => void;
}

export function SettingsPanel({ settings, onClose }: SettingsPanelProps) {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Settings
          </h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            Back to Editor
          </Button>
        </div>

        <Tabs defaultValue="preferences" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preferences" className="gap-2">
              <Settings className="w-4 h-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-2">
              <Info className="w-4 h-4" />
              About
            </TabsTrigger>
          </TabsList>

          {/* Preferences */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Editor Preferences</CardTitle>
                <CardDescription>
                  Customize your LogicPy experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Show Hints</Label>
                    <p className="text-sm text-muted-foreground">
                      Display helpful hints and tips while learning
                    </p>
                  </div>
                  <Switch
                    checked={settings.settings.showHints}
                    onCheckedChange={settings.toggleHints}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reset Settings</CardTitle>
                <CardDescription>
                  Clear all settings and start fresh
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={() => {
                    settings.resetSettings();
                    toast.success('Settings reset!');
                  }}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset All Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About LogicPy</CardTitle>
                <CardDescription>
                  The Logic-First Python Translator
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  LogicPy helps beginners learn Python by translating plain English logic
                  into valid Python code. Instead of memorizing syntax, you focus on
                  computational thinking.
                </p>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Features:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>7 core concepts — from print to functions</li>
                    <li>Guided starters to help you begin</li>
                    <li>Instant translation from English to Python</li>
                    <li>In-browser code execution (no server needed)</li>
                    <li>"Why This Works" educational cards</li>
                    <li>"How would a pro write this?" tips</li>
                    <li>Challenge mode to practice debugging</li>
                    <li>Export code as .py files</li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Version:</span> 1.0<br />
                    <span className="font-medium">Translation:</span> Local Engine (no API keys needed)<br />
                    <span className="font-medium">Python Runtime:</span> Pyodide 3.11<br />
                    <span className="font-medium">Built with:</span> React, TypeScript, Tailwind CSS
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}