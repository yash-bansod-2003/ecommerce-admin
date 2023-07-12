import { UserButton } from "@clerk/nextjs"

import { MainNav } from '@/components/main-nav';

export const Navbar = () => {
    return (
        <div className="border-b">
            <div className="h-16  flex items-center px-4 ">
                <div className="mr-6">
                    This is store switcher
                </div>
                <MainNav />
                <div className="ml-auto flex items-center gap-4">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </div>
    )
}
