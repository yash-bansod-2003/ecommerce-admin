"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ColorColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";


interface ColorClientProps {
    colors: Array<ColorColumn>;
}


export const ColorClient: React.FC<ColorClientProps> = ({ colors }) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex justify-between items-center">
                <Heading
                    title={`Colors (${colors.length})`}
                    description="Manage Colors For Your Store"
                />

                <Button
                    onClick={() => {
                        router.push(`/${params.storeId}/colors/new`)
                    }}
                >
                    <PlusCircle className="h-5 w-5 mr-4" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={colors} filterKey="name" />
            <Heading
                title="API"
                description="Api calls for sizes"
            />
            <ApiList entityName="colors" entityIdName="colorId" />
        </>
    )
}
