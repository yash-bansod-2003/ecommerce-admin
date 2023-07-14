
import prismaDb from "@/lib/prismadb";
import { ColorClient } from "./components/client";
import { ColorColumn } from "./components/columns";

import { format } from 'date-fns';

interface ColorPageProps {
    params: { storeId: string }
}

const ColorPage: React.FC<ColorPageProps> = async ({ params }) => {

    const colors = await prismaDb.color.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedColors: Array<ColorColumn> = colors.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }));

    return (
        <div className="flex flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <ColorClient colors={formattedColors} />
            </div>
        </div>
    )
}

export default ColorPage;