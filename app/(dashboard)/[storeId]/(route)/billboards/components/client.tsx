"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { billboard } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface BillBoardClientProps {
    billboard: Array<billboard>;
}


export const BillBoardClient: React.FC<BillBoardClientProps> = ({ billboard }) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex justify-between items-center">
                <Heading
                    title={`Billboard (${billboard.length})`}
                    description="Manage billboards for your store"
                />

                <Button
                    onClick={() => {
                        router.push(`/${params.storeId}/billboards/new`)
                    }}
                >
                    <PlusCircle className="h-5 w-5 mr-4" />
                    Add New
                </Button>
            </div>
            <Separator />
        </>
    )
}
