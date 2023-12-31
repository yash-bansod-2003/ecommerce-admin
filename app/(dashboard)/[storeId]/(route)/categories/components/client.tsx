"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { billboard } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";


interface CategoryClientProps {
    categories: Array<CategoryColumn>;
}


export const CategoryClient: React.FC<CategoryClientProps> = ({ categories }) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex justify-between items-center">
                <Heading
                    title={`Category (${categories.length})`}
                    description="Manage Categories For Your Store"
                />

                <Button
                    onClick={() => {
                        router.push(`/${params.storeId}/categories/new`)
                    }}
                >
                    <PlusCircle className="h-5 w-5 mr-4" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={categories} filterKey="name" />
            <Heading
                title="API"
                description="Api calls for categories"
            />
            <ApiList entityName="categories" entityIdName="categoryId" />
        </>
    )
}
