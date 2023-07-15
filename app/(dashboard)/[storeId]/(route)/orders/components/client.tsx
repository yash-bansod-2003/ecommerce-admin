"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";


interface OrderClientProps {
    orders: Array<OrderColumn>;
}


export const OrderClient: React.FC<OrderClientProps> = ({ orders }) => {
    const params = useParams();
    const router = useRouter();

    return (
        <>
            <div className="flex justify-between items-center">
                <Heading
                    title={`Orders (${orders.length})`}
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
            <DataTable columns={columns} data={orders} filterKey="label" />
        </>
    )
}
