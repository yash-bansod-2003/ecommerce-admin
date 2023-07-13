"use client"

import React, { useState } from "react";
import { Store as StoreIcon, ChevronsUpDown, Check, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { store } from "@prisma/client"
import { useStoreModal } from "@/hooks/use-store-modal"
import { useParams, useRouter } from "next/navigation"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Array<store>
}


export function StoreSwitcher({ className, items = [] }: StoreSwitcherProps) {
    const storeModal = useStoreModal();
    const param = useParams();
    const router = useRouter();

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }));

    const currentStore = formattedItems.find((item) => item.value === param.storeId);

    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = React.useState<string>("");

    const onStoreSelect = (store: { label: string, value: string }) => {
        setOpen(false);
        router.push(`/${store.value}`);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="store icon"
                    className="w-[200px] justify-between"
                >
                    <StoreIcon />
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search Store..." />
                    <CommandEmpty>No Store found.</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {formattedItems.map((store) => (
                                <CommandItem
                                    key={store.value}
                                    onSelect={() => onStoreSelect(store)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            currentStore?.value === store.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {store.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    setOpen(false);
                                    storeModal.onOpen();
                                }}
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
