import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { Token } from '@/lib/types';

export async function POST(req: Request) {
    const { accessToken, clientToken } = await req.json();

    // accessToken 必须存在
    if (!accessToken) {
        return NextResponse.json(
            { error: "BadRequestException", errorMessage: "Invalid request body." },
            { status: 400 }
        );
    }

    const tokenJson = await redis.get<Token>(`token:${accessToken}`);

    if (!tokenJson) {
        // 令牌无效返回 403
        return NextResponse.json({
            error: "ForbiddenOperationException",
            errorMessage: "Invalid token.",
        }, { status: 403 });
    }

    const token = typeof tokenJson === 'string'
        ? JSON.parse(tokenJson) as Token
        : tokenJson;

    // 若请求指定了 clientToken，则必须匹配
    if (clientToken && token.clientToken !== clientToken) {
        return NextResponse.json({
            error: "ForbiddenOperationException",
            errorMessage: "Invalid token.",
        }, { status: 403 });
    }

    // 验证成功 返回 204 无内容
    return new NextResponse(null, { status: 204 });
}