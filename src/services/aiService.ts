import type { AIConfig } from '@/types';


export function isAIConfigured(config: AIConfig): boolean {
  return config.enabled && !!config.apiKey && config.apiKey.length > 10;
}


export const defaultAIConfig: AIConfig = {
  provider: 'local', // AI service — currently local-only.
  enabled: false
};