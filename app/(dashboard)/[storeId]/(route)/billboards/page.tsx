
import prismaDb from "@/lib/prismadb";
import { BillBoardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";

import { format } from 'date-fns';

interface BillboardPageProps {
    params: { storeId: string }
}

const BillboardPage: React.FC<BillboardPageProps> = async ({ params }) => {

    const billboards = await prismaDb.billboard.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedBillboards: Array<BillboardColumn> = billboards.map((billboard) => ({
        id: billboard.id,
        label: billboard.label,
        createdAt: format(billboard.createdAt, "MMMM do, yyyy")
    }));

    return (
        <div className="flex flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <BillBoardClient billboards={formattedBillboards} />
            </div>
        </div>
    )
}

export default BillboardPage;