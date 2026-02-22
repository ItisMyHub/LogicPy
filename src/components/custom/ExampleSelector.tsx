import { useState } from 'react';
import { BookOpen, X, Sparkles, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { examples, getCategories } from '@/data/examples';
import type { Example, ExampleCategory } from '@/types';

/**
 * Category colors — aligned with the 7 ConceptLevel categories from Step 1.
 * Old 10-category map replaced with the 7 that actually exist in the data.
 */
const categoryColors: Record<ExampleCategory, string> = {
  'print':      'bg-blue-100 text-blue-700 border-blue-200',
  'variables':  'bg-cyan-100 text-cyan-700 border-cyan-200',
  'math':       'bg-red-100 text-red-700 border-red-200',
  'conditions': 'bg-purple-100 text-purple-700 border-purple-200',
  'loops':      'bg-pink-100 text-pink-700 border-pink-200',
  'lists':      'bg-green-100 text-green-700 border-green-200',
  'functions':  'bg-orange-100 text-orange-700 border-orange-200',
};

interface ExampleSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (example: Example) => void;
}

export function ExampleSelector({ isOpen, onClose, onSelect }: ExampleSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<ExampleCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const categories = getCategories();

  const filteredExamples = examples.filter(example => {
    const matchesCategory = selectedCategory === 'all' || example.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || example.difficulty === selectedDifficulty;
    const matchesSearch =
      example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.logic.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <Card className="w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Example Library
              <Badge variant="secondary">{examples.length} examples</Badge>
            </CardTitle>
            <CardDescription>
              Click any example to load it into the editor
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        {/* Search and Filters */}
        <div className="px-6 pb-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search examples..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="text-xs"
            >
              All ({examples.length})
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="text-xs"
              >
                {cat.label} ({cat.count})
              </Button>
            ))}
          </div>

          {/* Difficulty Filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Difficulty:</span>
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((diff) => (
              <Button
                key={diff}
                variant={selectedDifficulty === diff ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedDifficulty(diff)}
                className="text-xs capitalize h-6"
              >
                {diff}
              </Button>
            ))}
          </div>
        </div>

        {/* Examples List */}
        <div className="flex-1 overflow-auto px-6">
          <div className="grid gap-3 pb-6">
            {filteredExamples.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No examples match your search</p>
              </div>
            ) : (
              filteredExamples.map((example) => (
                <button
                  key={example.id}
                  onClick={() => {
                    onSelect(example);
                    onClose();
                  }}
                  className="text-left p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded border ${categoryColors[example.category] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                          {example.category}
                        </span>
                        <Badge
                          variant={example.difficulty === 'beginner' ? 'default' : example.difficulty === 'intermediate' ? 'secondary' : 'destructive'}
                          className="text-xs capitalize"
                        >
                          {example.difficulty}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {example.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {example.description}
                      </p>
                      <code className="text-xs bg-secondary px-2 py-1 rounded font-mono text-primary">
                        {example.logic}
                      </code>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-border bg-card/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Pro tip: Try modifying examples to see how Python syntax changes!</span>
          </div>
        </div>
      </Card>
    </div>
  );
}