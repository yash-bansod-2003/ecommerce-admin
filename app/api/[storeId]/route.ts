import prismaDb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {

        if (!params.storeId) {
            return new NextResponse("no store id provides", { status: 400 });
        }

        const store = await prismaDb.store.findFirst({
            where: {
                id: params.storeId
            }
        });

        if (!store) {
            return new NextResponse("something went wrong", { status: 500 });
        }

        return NextResponse.json(store, { status: 200 });

    } catch (error) {
        console.log('[STORE_GET]', error);
        return new NextResponse("internal server error", { status: 500 });
    }
}