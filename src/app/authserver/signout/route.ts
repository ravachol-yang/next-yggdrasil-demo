import {redis} from "@/lib/redis";
import {NextResponse} from "next/server";
import {DB} from "@/lib/database";
import {ForbiddenOperationException} from "@/lib/types";

export async function POST(req: Request) {
    const { username, password } = await req.json();

    const user = DB.auth(username, password);

    if (!user) {
        return NextResponse.json(
            new ForbiddenOperationException("Invalid credentials. Invalid username or password."),
            {status: 403});
    }

    const tokens = await redis.smembers(`user_tokens:${user.user.id}`);

    if (tokens.length > 0) {
        const tokenKeys = tokens.map(token => `token:${token}`);
        await redis.del(...tokenKeys, `user_tokens:${user.user.id}`);
    }

    return new NextResponse(null, { status: 204 });
}