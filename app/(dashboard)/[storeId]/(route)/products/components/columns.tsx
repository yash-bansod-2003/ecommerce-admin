"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellActions } from "./cell-actions";


export type ProductColumn = {
    id: string;
    name: string;
    isFeatured: boolean;
    isArchived: boolean;
    price: string;
    category: string;
    size: string;
    color: string;
    createdAt: string;
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "isArchived",
        header: "Archived",
    },
    {
        accessorKey: "isFeatured",
        header: "Featured",
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "size",
        header: "Size",
    },
    {
        accessorKey: "color",
        header: "Color",
        cell: ({ row }) => (
            <div className="flex items-center gap-4">
                <div className="p-3 border-4 rounded-full" style={{ backgroundColor: row.original.color }} />
                {row.original.color}
            </div>
        )
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellActions data={row.original} />,
    },
]
