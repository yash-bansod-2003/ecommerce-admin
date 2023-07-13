import { UserButton, auth } from "@clerk/nextjs"

import { MainNav } from '@/components/main-nav';
import { StoreSwitcher } from '@/components/store-switcher';
import prismaDb from "@/lib/prismadb";
import { redirect } from "next/navigation";

export const Navbar = async () => {
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const stores = await prismaDb.store.findMany({
        where: {
            userId
        }
    });

    return (
        <div className="border-b">
            <div className="h-16 flex items-center px-4 gap-6">
                <StoreSwitcher items={stores} />
                <MainNav />
                <div className="ml-auto flex items-center gap-4">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </div>
    )
}