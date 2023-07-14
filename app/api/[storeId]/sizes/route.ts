import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("unauthorize", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }

        const store = await prismaDb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!store) {
            return new NextResponse("no store found", { status: 404 });
        }

        const body = await req.json();

        const { name, value } = body;

        if (!name) {
            return new NextResponse("name is required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("value is required", { status: 400 });
        }

        const storeByUser = await prismaDb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUser) {
            return new NextResponse("no store found", { status: 404 });
        }

        const size = await prismaDb.size.create({
            data: {
                name,
                storeId: params.storeId,
                value
            }
        })

        return NextResponse.json(size, { status: 200 });

    } catch (error) {
        console.log('[SIZE_POST]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}


export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }

        const sizes = await prismaDb.size.findMany({
            where: {
                storeId: params.storeId
            }
        })

        if (!sizes) {
            return new NextResponse("something went wrong", { status: 500 });
        }

        return NextResponse.json(sizes, { status: 200 });

    } catch (error) {
        console.log('[SIZE_GET]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}