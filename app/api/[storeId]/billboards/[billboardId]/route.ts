import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }

        if (!params.billboardId) {
            return new NextResponse("no billboard id provides", { status: 400 });
        }

        /* userId is not unique so we cant use delete we has to use deleteMany*/
        const billboard = await prismaDb.store.findFirst({
            where: {
                id: params.billboardId
            }
        });

        return NextResponse.json(billboard, { status: 200 });

    } catch (error) {
        console.log('[BILLBOARD_GET]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { billboardId: string, storeId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("unauthorize", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }


        if (!params.billboardId) {
            return new NextResponse("no billboard id provides", { status: 400 });
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

        const updatedBillboard = await prismaDb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageURL
            }
        });

        return NextResponse.json(updatedBillboard, { status: 200 });

    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("unauthorize", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }

        if (!params.billboardId) {
            return new NextResponse("no billboard id provides", { status: 400 });
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

        /* userId is not unique so we cant use delete we has to use deleteMany*/
        const deletedBillboard = await prismaDb.store.deleteMany({
            where: {
                id: params.billboardId
            }
        })

        return NextResponse.json(deletedBillboard, { status: 200 });

    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}