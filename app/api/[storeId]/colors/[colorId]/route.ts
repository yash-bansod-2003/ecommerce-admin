import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { storeId: string, colorId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }

        if (!params.colorId) {
            return new NextResponse("no color id provides", { status: 400 });
        }

        const color = await prismaDb.color.findFirst({
            where: {
                id: params.colorId,
            }
        });

        return NextResponse.json(color, { status: 200 });

    } catch (error) {
        console.log('[COLOR_GET]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, colorId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("unauthorize", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }


        if (!params.colorId) {
            return new NextResponse("no color id provides", { status: 400 });
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

        const updatedColor = await prismaDb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(updatedColor, { status: 200 });

    } catch (error) {
        console.log('[COLOR_PATCH]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, colorId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("unauthorize", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }

        if (!params.colorId) {
            return new NextResponse("no color id provides", { status: 400 });
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
        const deletedColor = await prismaDb.color.deleteMany({
            where: {
                id: params.colorId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(deletedColor, { status: 200 });

    } catch (error) {
        console.log('[COLOR_DELETE]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}