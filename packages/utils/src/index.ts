export function signMessage(message: string, wallet: any): Promise<string> {
  // Pseudo implementation
  return Promise.resolve("signed-" + message);
}

export function createMetadataInstruction(metadata: string, wallet: string): any {
  // Pseudo Solana instruction
  return { metadata, wallet };
}