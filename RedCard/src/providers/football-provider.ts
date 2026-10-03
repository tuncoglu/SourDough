import type { LiveMatch } from "@/domain/match";

export interface FootballProvider {
  readonly name: string;
  getLiveMatches(): Promise<LiveMatch[]>;
}

export class ProviderError extends Error {
  constructor(message: string, public readonly retryAfterMs?: number) {
    super(message);
    this.name = "ProviderError";
  }
}
