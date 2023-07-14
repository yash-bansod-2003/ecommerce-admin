"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SizeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";


interface SizeClientProps {
    sizes: Array<SizeColumn>;
}


export const SizeClient: React.FC<SizeClientProps> = ({ sizes }) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex justify-between items-center">
                <Heading
                    title={`Sizes (${sizes.length})`}
                    description="Manage categories for your store"
                />

                <Button
                    onClick={() => {
                        router.push(`/${params.storeId}/sizes/new`)
                    }}
                >
                    <PlusCircle className="h-5 w-5 mr-4" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={sizes} filterKey="name" />
            <Heading
                title="API"
                description="Api calls for sizes"
            />
            <ApiList entityName="sizes" entityIdName="sizeId" />
        </>
    )
}
