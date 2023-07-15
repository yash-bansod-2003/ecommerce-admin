import prismaDb from "@/lib/prismadb"
import { ProductForm } from "./components/product-form"

interface BillBoardPageProps {
    params: { productId: string, storeId: string }
}

const ProductPage: React.FC<BillBoardPageProps> = async ({ params }) => {

    const product = await prismaDb.product.findUnique({
        where: {
            id: params.productId
        },
        include: {
            images: true
        }
    });

    const sizes = await prismaDb.size.findMany({
        where: {
            storeId: params.storeId
        }
    });

    const categories = await prismaDb.category.findMany({
        where: {
            storeId: params.storeId
        }
    });

    const colors = await prismaDb.color.findMany({
        where: {
            storeId: params.storeId
        }
    });

    return (
        <div className="flex flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm
                    product={product}
                    sizes={sizes}
                    categories={categories}
                    colors={colors}
                />
            </div>
        </div>
    )
}

export default ProductPage;