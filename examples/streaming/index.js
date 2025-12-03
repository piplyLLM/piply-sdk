require('dotenv').config();
const { PiplyClient } = require('piply-sdk');
const { Connection } = require('@solana/web3.js');

const piply = new PiplyClient({
  rpc: new Connection(process.env.SOLANA_RPC_URL),
  relayerUrl: process.env.PIPLY_RELAYER_URL,
});

async function main() {
  const stream = await piply.streamGenerate({
    model: 'piply-compact-v1',
    prompt: 'List 5 funny taglines for PiplyCoin',
    wallet: 'dummy-wallet',
  });

  stream.on('data', (chunk) => console.log(chunk));
  stream.on('end', () => console.log('done'));
}

main();