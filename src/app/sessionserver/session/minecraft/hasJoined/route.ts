import {DB} from "@/lib/database";
import {NextResponse} from "next/server";
import {redis} from "@/lib/redis";
import {Session} from "@/lib/types";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    const serverId = searchParams.get('serverId');

    if (!username || !serverId) {
        return new NextResponse(null, { status: 204 });
    }
    const sessionJson = await redis.get<Session>(`server:${serverId}`);

    const session = typeof sessionJson === 'string'
        ? JSON.parse(sessionJson) as Session
        : sessionJson;

    if (!session || session.username !== username) {
        return new NextResponse(null, { status: 204 });
    }

    const profile = DB.getProfileByIdWithProperties(session.userid.replace(/-/g, ''));

    if (!profile) {
        return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(profile);
}