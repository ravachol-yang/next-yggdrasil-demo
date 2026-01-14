import { NextResponse } from 'next/server';
import {rsaPubKey} from "@/lib/crypto";

export async function GET() {
    const publicKey = rsaPubKey;
    const skinDomain = process.env.SKIN_DOMAIN?.replace(/\\n/g, '\n');

    return NextResponse.json({
        meta: {
            serverName: "Next-Yggdrasil",
            implementationName: "next-yggdrasil",
            implementationVersion: "1.0.0",
            "feature.non_email_login": true
        },
        skinDomains: [skinDomain],
        signaturePublickey: publicKey
    });
}