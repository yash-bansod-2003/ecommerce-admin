"use client";

import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { SizeColumn } from './columns'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/components/ui/use-toast';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import { AlertModal } from '@/components/modals/alert-modal';
import { Separator } from '@/components/ui/separator';

interface CellActionsProps {
    data: SizeColumn;
}

export const CellActions: React.FC<CellActionsProps> = ({ data }) => {
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const onCopy = (description: string) => {
        navigator.clipboard.writeText(description);
        toast({ title: 'size id copied to clipboard.' })
    }

    async function onDelete() {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/sizes/${data.id}`);
            router.refresh();
            toast({
                variant: 'default',
                title: "size deleted successfully.",
            });
        } catch (error) {
            setLoading(false);
            toast({
                variant: 'destructive',
                title: "make sure your size modal is empty.",
            });
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                loading={loading}
                onConfirm={onDelete}
            />
            <DropdownMenu>
                <DropdownMenuTrigger>
                    {/* for screen readers */}
                    <span className='sr-only'>Open</span>
                    <MoreHorizontal className='h-5 w-5' />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => onCopy(data.id)}
                    >
                        <Copy className='h-5 w-5 mr-2' />
                        copy id
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => router.push(`/${params.storeId}/billboards/${data.id}`)}
                    >
                        <Edit className='h-5 w-5 mr-2' />
                        update
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setOpen(true)}
                    >
                        <Trash className='h-5 w-5 mr-2' />
                        delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </>
    )
}