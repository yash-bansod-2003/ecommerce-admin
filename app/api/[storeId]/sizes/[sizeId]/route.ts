import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { storeId: string, sizeId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }

        if (!params.sizeId) {
            return new NextResponse("no size id provides", { status: 400 });
        }

        const size = await prismaDb.size.findFirst({
            where: {
                id: params.sizeId,
            }
        });

        return NextResponse.json(size, { status: 200 });

    } catch (error) {
        console.log('[SIZE_GET]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, sizeId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("unauthorize", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }


        if (!params.sizeId) {
            return new NextResponse("no size id provides", { status: 400 });
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

        const updatedSize = await prismaDb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(updatedSize, { status: 200 });

    } catch (error) {
        console.log('[SIZE_PATCH]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, sizeId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("unauthorize", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }

        if (!params.sizeId) {
            return new NextResponse("no size id provides", { status: 400 });
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
        const deletedSize = await prismaDb.size.deleteMany({
            where: {
                id: params.sizeId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(deletedSize, { status: 200 });

    } catch (error) {
        console.log('[SIZE_DELETE]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}