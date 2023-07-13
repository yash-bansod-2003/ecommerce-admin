
import prismaDb from "@/lib/prismadb";
import { BillBoardClient } from "./components/client";

interface BillboardPageProps {
    params: { storeId: string }
}

const BillboardPage: React.FC<BillboardPageProps> = async ({ params }) => {

    const billboards = await prismaDb.billboard.findMany({
        where: {
            storeId: params.storeId
        }
    });

    return (
        <div className="flex flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <BillBoardClient billboard={billboards} />
            </div>
        </div>
    )
}

export default BillboardPage;