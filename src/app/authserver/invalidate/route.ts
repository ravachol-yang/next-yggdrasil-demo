import {redis} from "@/lib/redis";
import {NextResponse} from "next/server";
import {Token} from "@/lib/types";

export async function POST(req: Request) {
    const { accessToken } = await req.json();

    const tokenJson = await redis.get<Token>(`token:${accessToken}`);

    const token = typeof tokenJson === 'string'
        ? JSON.parse(tokenJson) as Token
        : tokenJson;

    await redis.del(`token:${accessToken}`);

    if (token) {
        await redis.srem(`user_tokens:${token.owner}`, accessToken);
    }

    return new NextResponse(null, { status: 204 });
}