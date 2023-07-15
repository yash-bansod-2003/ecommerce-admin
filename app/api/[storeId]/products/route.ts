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

        const { name,
            images,
            price,
            categoryId,
            colorId,
            sizeId,
            isFeatured,
            isArchived
        } = body;

        if (!name) {
            return new NextResponse("name is required", { status: 400 });
        }

        if (!images || !images.length) {
            return new NextResponse("images is required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("price is required", { status: 400 });
        }
        if (!categoryId) {
            return new NextResponse("categoryId is required", { status: 400 });
        }
        if (!colorId) {
            return new NextResponse("colorId is required", { status: 400 });
        }
        if (!sizeId) {
            return new NextResponse("sizeId is required", { status: 400 });
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

        const product = await prismaDb.product.create({
            data: {
                name,
                price,
                isArchived: isArchived ? true : false,
                isFeatured: isFeatured ? true : false,
                categoryId,
                colorId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                },
                sizeId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(product, { status: 200 });

    } catch (error) {
        console.log('[PRODUCT_POST]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}


export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {

        const { searchParams } = new URL(req.url);

        const categoryId = searchParams.get('categoryId') || undefined;
        const colorId = searchParams.get('colorId') || undefined;
        const sizeId = searchParams.get('sizeId') || undefined;
        const isFeatured = searchParams.get('isFeatured') || undefined;

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }

        const products = await prismaDb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                color: true,
                size: true,
                category: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        if (!products) {
            return new NextResponse("something went wrong", { status: 500 });
        }

        return NextResponse.json(products, { status: 200 });

    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}