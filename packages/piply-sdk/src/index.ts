import { Connection, Transaction, PublicKey } from "@solana/web3.js";
import { EventEmitter } from "events";
import {
  PiplyClientOptions,
  GenerateTextOptions,
  GenerateTextResponse,
  StreamGenerateOptions,
  CreateTxOptions,
  RequestStatus,
  ModerationResponse,
  Stream
} from "@piply/types";
import { signMessage, createMetadataInstruction } from "@piply/utils";

class PiplyStream extends EventEmitter implements Stream {
  constructor(private relayerUrl: string, private opts: StreamGenerateOptions) {
    super();
    this.startStream();
  }

  private async startStream() {
    const response = await fetch(`${this.relayerUrl}/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.opts),
    });

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        this.emit("end");
        break;
      }
      const chunk = decoder.decode(value);
      this.emit("data", chunk);
    }
  }
}

export class PiplyClient {
  constructor(private opts: PiplyClientOptions) {}

  async generateText(opts: GenerateTextOptions): Promise<GenerateTextResponse> {
    const signature = await signMessage(opts.prompt, opts.wallet);
    const response = await fetch(`${this.opts.relayerUrl}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.opts.apiKey && { "Authorization": `Bearer ${this.opts.apiKey}` }),
      },
      body: JSON.stringify({ ...opts, signature }),
    });
    return response.json();
  }

  async streamGenerate(opts: StreamGenerateOptions): Promise<Stream> {
    return new PiplyStream(this.opts.relayerUrl, opts);
  }

  async createOnchainMetadataTx(opts: CreateTxOptions): Promise<Transaction> {
    const instruction = createMetadataInstruction(opts.metadata, opts.wallet);
    const tx = new Transaction().add(instruction);
    tx.recentBlockhash = (await this.opts.rpc.getRecentBlockhash()).blockhash;
    tx.feePayer = new PublicKey(opts.wallet);
    return tx;
  }

  async getRequestStatus(id: string): Promise<RequestStatus> {
    const response = await fetch(`${this.opts.relayerUrl}/status/${id}`, {
      headers: this.opts.apiKey ? { "Authorization": `Bearer ${this.opts.apiKey}` } : {},
    });
    return response.json();
  }

  async moderate(text: string): Promise<ModerationResponse> {
    const response = await fetch(`${this.opts.relayerUrl}/moderate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.opts.apiKey && { "Authorization": `Bearer ${this.opts.apiKey}` }),
      },
      body: JSON.stringify({ text }),
    });
    return response.json();
  }
}