require('dotenv').config();
const { PiplyClient } = require('piply-sdk');
const { Connection } = require('@solana/web3.js');

const piply = new PiplyClient({
  rpc: new Connection(process.env.SOLANA_RPC_URL),
  relayerUrl: process.env.PIPLY_RELAYER_URL,
  apiKey: process.env.PIPLY_API_KEY,
});

async function main() {
  const out = await piply.generateText({
    model: 'piply-compact-v1',
    prompt: 'Write a meme coin slogan',
    wallet: 'dummy-wallet', // In real use, use actual wallet
  });
  console.log(out.text);
}

main();