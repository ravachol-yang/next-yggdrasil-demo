import {DB} from "@/lib/database";
import {NextResponse} from "next/server";

export async function GET(req: Request,
                          { params }: { params: Promise<{uuid: string}> }) {
    const {uuid} = await params;

    const profile = DB.getProfileByIdWithProperties(uuid.replace(/-/g, ''));
    if (!profile) {
        return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(profile);
}