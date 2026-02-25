import type { AIConfig } from '@/types';


export function isAIConfigured(config: AIConfig): boolean {
  if (!config.enabled) return false;
  // Local / Ollama does not require an API key
  if (config.provider === 'local') return true;
  return !!config.apiKey && config.apiKey.length > 10;
}


export const defaultAIConfig: AIConfig = {
  provider: 'local', // Defaults to Ollama (http://localhost:11434)
  enabled: true,
  model: 'llama3.2',
};