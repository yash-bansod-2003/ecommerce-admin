import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { storeId: string, productId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }

        if (!params.productId) {
            return new NextResponse("no size id provides", { status: 400 });
        }

        const product = await prismaDb.product.findFirst({
            where: {
                id: params.productId,
            }
        });

        return NextResponse.json(product, { status: 200 });

    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, productId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("unauthorize", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }


        if (!params.productId) {
            return new NextResponse("no product id provides", { status: 400 });
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

        await prismaDb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : false,
                isArchived: isArchived ? true : false,
                images: {
                    deleteMany: {}
                }
            }
        });

        const product = await prismaDb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product, { status: 200 });

    } catch (error) {
        console.log('[PRODUCT_PATCH]', error);
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