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

        const { label, imageURL } = body;

        if (!label) {
            return new NextResponse("name is required", { status: 400 });
        }

        if (!imageURL) {
            return new NextResponse("imageURL is required", { status: 400 });
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

        const billboard = await prismaDb.billboard.create({
            data: {
                label,
                imageURL,
                storeId: params.storeId
            }
        })

        return NextResponse.json(billboard, { status: 200 });

    } catch (error) {
        console.log('[STORE_PATCH]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }

        const billboards = await prismaDb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        })

        if (!billboards) {
            return new NextResponse("something went wrong", { status: 500 });
        }

        return NextResponse.json(billboards, { status: 200 });

    } catch (error) {
        console.log('[STORE_PATCH]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}