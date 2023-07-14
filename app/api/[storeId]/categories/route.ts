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

        const { name, billboardId } = body;

        if (!name) {
            return new NextResponse("name is required", { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse("billboardId is required", { status: 400 });
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

        const category = await prismaDb.category.create({
            data: {
                name,
                storeId: params.storeId,
                billboardId
            }
        })

        return NextResponse.json(category, { status: 200 });

    } catch (error) {
        console.log('[CATEGORY_PATCH]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }

        const categories = await prismaDb.category.findMany({
            where: {
                storeId: params.storeId
            }
        })

        if (!categories) {
            return new NextResponse("something went wrong", { status: 500 });
        }

        return NextResponse.json(categories, { status: 200 });

    } catch (error) {
        console.log('[CATEGORY_PATCH]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}