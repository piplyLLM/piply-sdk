require('dotenv').config();
const { PiplyClient } = require('piply-sdk');
const { Connection, Keypair } = require('@solana/web3.js');

const piply = new PiplyClient({
  rpc: new Connection(process.env.SOLANA_RPC_URL),
  relayerUrl: process.env.PIPLY_RELAYER_URL,
});

async function main() {
  const wallet = Keypair.generate(); // Dummy wallet
  const tx = await piply.createOnchainMetadataTx({
    metadata: 'Generated metadata',
    wallet: wallet.publicKey.toString(),
  });
  console.log('Transaction created:', tx);
}

main();