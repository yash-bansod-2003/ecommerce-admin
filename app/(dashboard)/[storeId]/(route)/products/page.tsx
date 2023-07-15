
import prismaDb from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";

import { format } from 'date-fns';
import { formatter } from "@/lib/utils";

interface ProductPageProps {
    params: { storeId: string }
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {

    const products = await prismaDb.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            size: true,
            color: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedProducts: Array<ProductColumn> = products.map((item) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        color: item.color.value,
        size: item.size.name,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }));

    return (
        <div className="flex flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <ProductClient products={formattedProducts} />
            </div>
        </div>
    )
}

export default ProductPage;