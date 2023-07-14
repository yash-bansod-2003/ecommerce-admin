
import prismaDb from "@/lib/prismadb";
import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";

import { format } from 'date-fns';

interface CategoryPageProps {
    params: { storeId: string }
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params }) => {

    const categories = await prismaDb.category.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            billboard: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedCategories: Array<CategoryColumn> = categories.map((category) => ({
        id: category.id,
        name: category.name,
        billboardLabel: category.billboard.label,
        createdAt: format(category.createdAt, "MMMM do, yyyy")
    }));

    return (
        <div className="flex flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <CategoryClient categories={formattedCategories} />
            </div>
        </div>
    )
}

export default CategoryPage;