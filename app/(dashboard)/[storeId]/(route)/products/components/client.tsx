"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { billboard } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";


interface ProductClientProps {
    products: Array<ProductColumn>;
}


export const ProductClient: React.FC<ProductClientProps> = ({ products }) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex justify-between items-center">
                <Heading
                    title={`Products (${products.length})`}
                    description="Manage Products For Your Store"
                />

                <Button
                    onClick={() => {
                        router.push(`/${params.storeId}/products/new`)
                    }}
                >
                    <PlusCircle className="h-5 w-5 mr-4" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={products} filterKey="label" />
            <Heading
                title="API"
                description="Api calls for Products"
            />
            <ApiList entityName="products" entityIdName="productId" />
        </>
    )
}
