"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellActions } from "./cell-actions";


const ColorShow = ({ color }: { color: string }) => {
    return (
        <div className="flex items-center gap-4">
            {color}
            <div
                className="border p-3 rounded-full"
                style={{ backgroundColor: color }}
            />
        </div>
    )
}


export type ColorColumn = {
    id: string;
    name: string;
    value: string;
    createdAt: string;
}

export const columns: ColumnDef<ColorColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "value",
        header: "Value",
        cell: ({ row }) => <ColorShow color={row.original.value} />
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
