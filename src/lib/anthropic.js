import Anthropic from '@anthropic-ai/sdk';
import config from '../config/index.js';

if(!config.anthropic.apiKey) {
  throw new Error('ANTHROPIC_API_KEY is required');
}

export const anthropic = new Anthropic({
  apiKey: config.anthropic.apiKey,
});