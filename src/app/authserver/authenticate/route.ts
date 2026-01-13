import { NextResponse } from 'next/server';
import { DB } from '@/lib/database'
import {v4 as uuid4} from 'uuid';
import {redis} from "@/lib/redis";
import {ForbiddenOperationException, Token} from "@/lib/types";

export async function POST(req: Request) {
    const {username, password, clientToken, requestUser} = await req.json();

    const user = DB.getUserByEmail(username)

    if (!user || user.password !== password) {
        return NextResponse.json(
            new ForbiddenOperationException("Invalid credentials. Invalid username or password."),
            {status: 403});
    }

    const accessToken = uuid4().replace(/-/g, '');
    const finalClientToken = clientToken ? clientToken : uuid4().replace(/-/g, '')

    const availableProfiles = DB.getAvailableProfiles(user.id);

    let selectedProfile;

    if (availableProfiles.length === 1) {
        selectedProfile = availableProfiles[0];
    }

    const token:Token = {
        accessToken,
        clientToken:finalClientToken,
        owner: user.id,
        profileId: selectedProfile?.id,
        createdAt: new Date()
    }

    const EXPIRATION = 1296000;
    await redis.set(`token:${accessToken}`, JSON.stringify(token));
    await redis.expire(`token:${accessToken}`, EXPIRATION)
    await redis.sadd(`user_tokens:${user.id}`, accessToken);

    return NextResponse.json({
        accessToken,
        clientToken : finalClientToken,
        availableProfiles,
        selectedProfile,
        user: requestUser ? {
            ...user,
            password: undefined
        } : undefined,
    });

}