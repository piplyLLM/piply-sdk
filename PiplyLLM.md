# PiplyLLM — On-Chain LLM Utility for Solana
![Solana Monad SDK Banner](./public/banner.png)

## Full SDK Documentation

The Piply SDK is written in TypeScript and supports both Node.js and Browser environments. It provides wallet-signed requests and API key authentication.

### Installation

```bash
npm install piply-sdk @solana/web3.js
```

### Initialization

```typescript
import { PiplyClient } from "piply-sdk";
import { Connection } from "@solana/web3.js";

const piply = new PiplyClient({
  rpc: new Connection("https://api.mainnet-beta.solana.com"),
  relayerUrl: "http://piplyllm.xyz",
  apiKey?: "your-api-key", // optional for backend
});
```

### API Reference

#### `new PiplyClient(opts: PiplyClientOptions)`

Creates a new PiplyClient instance.

- `opts.rpc`: Solana Connection instance.
- `opts.relayerUrl`: Piply relayer endpoint.
- `opts.apiKey`: Optional API key for backend usage.

#### `generateText(opts: GenerateTextOptions): Promise<GenerateTextResponse>`

Generates text synchronously.

- `opts.model`: Model name, e.g., "piply-compact-v1".
- `opts.prompt`: The prompt string.
- `opts.wallet`: Wallet public key as string (for signing).

Returns: `{ text: string, id: string }`

#### `streamGenerate(opts: StreamGenerateOptions): Promise<Stream>`

Generates text with streaming.

- `opts.model`: Model name.
- `opts.prompt`: The prompt string.
- `opts.wallet`: Wallet public key as string.

Returns: Stream object with `on("data", callback)` and `on("end", callback)`.

#### `createOnchainMetadataTx(opts: CreateTxOptions): Promise<Transaction>`

Creates a transaction for on-chain metadata.

- `opts.metadata`: Metadata string.
- `opts.wallet`: Wallet public key.

Returns: Solana Transaction object.

#### `getRequestStatus(id: string): Promise<RequestStatus>`

Gets the status of a request.

- `id`: Request ID from generateText.

Returns: `{ status: "pending" | "completed" | "failed", result?: string }`

#### `moderate(text: string): Promise<ModerationResponse>`

Moderates content.

- `text`: Text to moderate.

Returns: `{ safe: boolean, reason?: string }`

## Examples

### Browser Example

```typescript
import { PiplyClient } from "piply-sdk";
import { Connection } from "@solana/web3.js";

const piply = new PiplyClient({
  rpc: new Connection(process.env.SOLANA_RPC_URL!),
  relayerUrl: process.env.PIPLY_RELAYER_URL!,
});

await window.solana.connect();

const out = await piply.generateText({
  model: "piply-compact-v1",
  prompt: "Write a meme coin slogan",
  wallet: window.solana.publicKey.toString(),
});

console.log(out.text);
```

### Streaming Example

```typescript
const stream = await piply.streamGenerate({
  model: "piply-compact-v1",
  prompt: "List 5 funny taglines for PiplyCoin",
  wallet: window.solana.publicKey.toString(),
});

stream.on("data", (chunk) => console.log(chunk));
stream.on("end", () => console.log("done"));
```

### Node.js Example

```typescript
const piply = new PiplyClient({
  rpc: new Connection(process.env.SOLANA_RPC_URL!),
  relayerUrl: process.env.PIPLY_RELAYER_URL!,
  apiKey: process.env.PIPLY_API_KEY!,
});

// Use as needed
```

### On-Chain Metadata Builder

```typescript
const tx = await piply.createOnchainMetadataTx({
  metadata: "Generated metadata",
  wallet: wallet.publicKey.toString(),
});

// Sign and send tx
await wallet.signAndSendTransaction(tx);
```

## .env Example

```env
# PiplyLLM Environment File
PIPLY_API_KEY="your-piply-api-key-here"

# Solana RPC endpoint
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"

# Optional: Devnet
SOLANA_RPC_DEVNET="https://api.devnet.solana.com"

# Piply relayer endpoint
PIPLY_RELAYER_URL="http://piplyllm.xyz"
```

## Architecture Diagram

```
Browser/Node
   ↓ wallet signature / API key
Piply SDK
   ↓
Piply Relayer
   ↓ job verified
Piply Inference Node
   ↓ result
Solana Program (optional write to chain)
```

## Monorepo Structure

```
/apps
  /landing  # Landing page app
  /docs     # Documentation site
  /playground # Interactive playground
/packages
  /piply-sdk    # Main SDK package
  /piply-types  # TypeScript types
  /utils        # Shared utilities
/examples
  /browser      # Browser usage examples
  /node         # Node.js examples
  /streaming    # Streaming examples
  /onchain      # On-chain integration examples
```

## Deploy Instructions

1. Clone the monorepo.
2. Install dependencies: `npm install`
3. Build packages: `npm run build`
4. For landing page: `cd apps/landing && npm run build && npm run deploy`
5. For SDK: Publish to npm from packages/piply-sdk
6. Set up relayer and inference nodes as per infrastructure docs.

This completes the PiplyLLM toolkit. All components are designed to be cohesive and runnable.