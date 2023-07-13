import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";

interface StorePageProps {
    params: {
        storeId: string
    }
}

const SettingsPage: React.FC<StorePageProps> = async ({ params }) => {
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const store = await prismaDb.store.findFirst({
        where: {
            id: params.storeId,
            userId,
        }
    });

    if (!store) {
        redirect('/');
    }

    return (
        <>
            <SettingsForm store={store} />
        </>
    )
}

export default SettingsPage;