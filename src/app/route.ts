import { NextResponse } from 'next/server';

export async function GET() {
    const publicKey = process.env.RSA_PUBLIC_KEY?.replace(/\\n/g, '\n');

    return NextResponse.json({
        meta: {
            serverName: "Next-Yggdrasil",
            implementationName: "next-yggdrasil",
            implementationVersion: "1.0.0",
            "feature.non_email_login": true
        },
        skinDomains: ["localhost"],
        signaturePublickey: publicKey
    });
}