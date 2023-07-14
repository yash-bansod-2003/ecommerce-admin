import prismaDb from "@/lib/prismadb"
import { CategoryForm } from "./components/category-form"

interface BillBoardPageProps {
    params: { categoryId: string, storeId: string }
}

const BillboardPage: React.FC<BillBoardPageProps> = async ({ params }) => {

    const category = await prismaDb.category.findUnique({
        where: {
            id: params.categoryId
        }
    });

    const billboards = await prismaDb.billboard.findMany({
        where: {
            storeId: params.storeId
        }
    });

    return (
        <div className="flex flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm category={category} billboards={billboards} />
            </div>
        </div>
    )
}

export default BillboardPage