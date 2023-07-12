import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("unauthorize", { status: 401 });
        }

        const body = await req.json();

        const { name } = body;

        if (!name) {
            return new NextResponse("name is required", { status: 400 });
        }

        const store = await prismaDb.store.create({
            data: {
                name,
                userId
            }
        });

        return NextResponse.json(store, { status: 201 });

    } catch (error) {
        console.log('[STORE_POST]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}