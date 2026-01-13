import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import {Token, ForbiddenOperationException, IllegalArgumentException} from '@/lib/types';
import { v4 as uuid4 } from 'uuid';
import {DB} from "@/lib/database";

export async function POST(req: Request) {
    const { accessToken, clientToken, requestUser, selectedProfile } = await req.json();

    const oldToken = await redis.get<Token>(`token:${accessToken}`);

    // 如果找不到旧令牌，则该请求无效
    if (!oldToken) {
        return NextResponse.json(new ForbiddenOperationException("Invalid token"),
            {status: 403});
    }

    const token = typeof oldToken === 'string'
        ? JSON.parse(oldToken) as Token
        : oldToken;

    // 校验 clientToken
    if (clientToken && token.clientToken !== clientToken) {
        return NextResponse.json(new ForbiddenOperationException("Invalid token"),
            {status: 403});
    }

    const user = DB.getUserById(token.owner);

    if (!user) {
        return NextResponse.json(new ForbiddenOperationException("Invalid token"),
            {status: 403});
    }

    const newAccessToken = uuid4().replace(/-/g, '');
    const EXPIRATION = 1296000;

    // 颁发新令牌，保持原有用户信息和 clientToken
    const newToken: Token = {
        ...token,
        accessToken: newAccessToken
    };

    let profile;

    if (selectedProfile) {
        if (token.profileId) {
            return NextResponse.json(new IllegalArgumentException(),
                {status: 403});
        }
        profile = DB.getProfileById(selectedProfile.id);
        if (!profile || profile.owner != newToken.owner) {
            return NextResponse.json(new ForbiddenOperationException("Invalid token"),
                {status: 403})
        }
        newToken.profileId = profile.id;
    }

    // 吊销旧令牌
    await redis.del(`token:${accessToken}`);
    await redis.srem(`user_tokens:${user.id}`, accessToken);

    await redis.set(`token:${newAccessToken}`, JSON.stringify(newToken));
    await redis.expire(`token:${newAccessToken}`, EXPIRATION);
    await redis.sadd(`user_tokens:${user.id}`, newAccessToken);

    // 4. 返回新令牌
    return NextResponse.json({
        accessToken: newAccessToken,
        clientToken: token.clientToken,
        selectedProfile: selectedProfile? profile : undefined,
        user: requestUser ? {
            id: user.id,
            email: user.email,
            properties: user.properties} : undefined,
    });
}