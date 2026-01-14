import crypto from 'node:crypto';
import {rsaPrivKey} from "@/lib/crypto";

export function signProperty (prop: string): string {
    const privateKey = rsaPrivKey;

    if (!privateKey) {
        console.error("Missing private key for signing");
        return "";
    }

    const signature = crypto.sign(
        "sha1",
        Buffer.from(prop),
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PADDING,
        }
    );

    return signature.toString('base64');
}