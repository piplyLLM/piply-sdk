export interface PiplyClientOptions {
  rpc: any; // Connection from @solana/web3.js
  relayerUrl: string;
  apiKey?: string;
}

export interface GenerateTextOptions {
  model: string;
  prompt: string;
  wallet: string;
}

export interface GenerateTextResponse {
  text: string;
  id: string;
}

export interface StreamGenerateOptions {
  model: string;
  prompt: string;
  wallet: string;
}

export interface CreateTxOptions {
  metadata: string;
  wallet: string;
}

export interface RequestStatus {
  status: "pending" | "completed" | "failed";
  result?: string;
}

export interface ModerationResponse {
  safe: boolean;
  reason?: string;
}

export class Stream {
  on(event: "data", callback: (chunk: string) => void): void;
  on(event: "end", callback: () => void): void;
}