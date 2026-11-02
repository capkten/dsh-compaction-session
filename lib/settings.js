import { Service } from '@deepseek-ai/cordis';
import { BasicCompactionEngine, resolveSessionCompactionConfig } from './index.js';
/** Shared, validated settings inherited by each isolated session compaction instance. */
export default class SessionCompactionSettings extends Service {
  static Config = BasicCompactionEngine.Config;
  constructor(ctx, config = {}) {
    super(ctx, 'sessionCompactionSettings');
    const rawConfig = ctx.fiber.entry === undefined ? config : ctx.fiber.entry.options.config ?? {};
    this.config = resolveSessionCompactionConfig(rawConfig);
  }
}
