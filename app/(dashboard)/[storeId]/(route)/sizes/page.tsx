
import prismaDb from "@/lib/prismadb";
import { SizeClient } from "./components/client";
import { SizeColumn } from "./components/columns";

import { format } from 'date-fns';

interface SizePageProps {
    params: { storeId: string }
}

const CategoryPage: React.FC<SizePageProps> = async ({ params }) => {

    const sizes = await prismaDb.size.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedSizes: Array<SizeColumn> = sizes.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }));

    return (
        <div className="flex flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <SizeClient sizes={formattedSizes} />
            </div>
        </div>
    )
}

export default CategoryPage;