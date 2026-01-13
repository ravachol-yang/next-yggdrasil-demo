import {DB} from "@/lib/database";
import {NextResponse} from "next/server";
import {ForbiddenOperationException, Token} from "@/lib/types";
import {redis} from "@/lib/redis";

export async function POST(req: Request) {
    const {accessToken, selectedProfile, serverId} = await req.json();

    const tokenJson = await redis.get<Token>(`token:${accessToken}`);

    const token = typeof tokenJson === 'string'
        ? JSON.parse(tokenJson) as Token
        : tokenJson;

    if (!token || token.profileId?.replace(/-/g, '') !== selectedProfile) {
        return NextResponse.json(new ForbiddenOperationException("Invalid token"),
            {status: 403});
    }

    const profile = DB.getProfileById(selectedProfile);

    // 根据blessing-skin的yggdrasil-api插件，这里应该返回403
    if (!profile) {
        return NextResponse.json(new ForbiddenOperationException("Invalid profile"),
            {status: 403});
    }

    await redis.set(`server:${serverId}`, JSON.stringify({accessToken, username: profile.name, userid: profile.id}));
    await redis.expire(`server:${serverId}`, 30);

    return new NextResponse(null, { status: 204 });
}