export const rsaPubKey = Buffer.from(process.env.RSA_PUBKEY_B64!, "base64").toString('utf-8');
export const rsaPrivKey = Buffer.from(process.env.RSA_PRIVKEY_B64!, "base64").toString('utf-8');