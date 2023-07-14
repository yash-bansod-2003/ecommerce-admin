import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { storeId: string, categoryId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }

        if (!params.categoryId) {
            return new NextResponse("no category id provides", { status: 400 });
        }

        const category = await prismaDb.category.findFirst({
            where: {
                id: params.categoryId,
            }
        });

        return NextResponse.json(category, { status: 200 });

    } catch (error) {
        console.log('[CATEGORY_GET]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { categoryId: string, storeId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("unauthorize", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }


        if (!params.categoryId) {
            return new NextResponse("no category id provides", { status: 400 });
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

        const { name, billboardId } = body;

        if (!name) {
            return new NextResponse("name is required", { status: 400 });
        }
        if (!billboardId) {
            return new NextResponse("billboard id is required", { status: 400 });
        }

        const updatedCategory = await prismaDb.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId
            }
        });

        return NextResponse.json(updatedCategory, { status: 200 });

    } catch (error) {
        console.log('[CATEGORY_PATCH]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, categoryId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("unauthorize", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }

        if (!params.categoryId) {
            return new NextResponse("no category id provides", { status: 400 });
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
        const deletedCategory = await prismaDb.category.deleteMany({
            where: {
                id: params.categoryId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(deletedCategory, { status: 200 });

    } catch (error) {
        console.log('[CATEGORY_DELETE]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}