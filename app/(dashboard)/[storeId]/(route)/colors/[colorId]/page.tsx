import prismaDb from "@/lib/prismadb"
import { ColorForm } from "./components/color-form"

interface SizePageProps {
    params: { colorId: string, storeId: string }
}

const ColorPage: React.FC<SizePageProps> = async ({ params }) => {

    const color = await prismaDb.color.findUnique({
        where: {
            id: params.colorId
        }
    });

    return (
        <div className="flex flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorForm color={color} />
            </div>
        </div>
    )
}

export default ColorPage;