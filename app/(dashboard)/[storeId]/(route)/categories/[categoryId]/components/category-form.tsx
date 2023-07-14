"use client";
import * as z from "zod"
import { billboard, category } from "@prisma/client"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField } from '@/components/ui/form';
import { Input } from "@/components/ui/input";

import { AlertModal } from "@/components/modals/alert-modal";

import { Trash } from "lucide-react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"



interface CategoryFormProps {
    category: category | null;
    billboards: Array<billboard>;
}

const formSchema = z.object({
    name: z.string().min(2).max(50),
    billboardId: z.string().min(2),
});

type BillboardFormValues = z.infer<typeof formSchema>;

export const CategoryForm: React.FC<CategoryFormProps> = ({ category, billboards }) => {
    const params = useParams();
    const router = useRouter();

    const { toast } = useToast();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const title = category ? "Edit Category" : "Create Category";
    const description = category ? "Edit a Category" : "Add a new Category";
    const toastMessage = category ? "Edit Category successfully" : "Create Category successfully";
    const action = category ? "save changes" : "create";


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: category?.name || "",
            billboardId: category?.billboardId || ""
        },
    })

    async function onSubmit(values: BillboardFormValues) {

        try {
            setLoading(true);
            if (category) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, values);
            }
            else {
                await axios.post(`/api/${params.storeId}/categories`, values);
            }
            router.push(`/${params.storeId}/categories`);
        }
        catch (error) {
            setLoading(false);
            toast({
                variant: 'destructive',
                title: "something went wrong",
            });
        }
        finally {
            setLoading(false);
        }
    }

    async function onDelete() {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.refresh();
            router.push('/');
            toast({
                variant: 'default',
                title: "category deleted",
            });
        } catch (error) {
            setLoading(false);
            toast({
                variant: 'destructive',
                title: "make sure your category is empty it will not contain products.",
            });
        }
        finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                loading={loading}
                onClose={() => setOpen(false)}
                onConfirm={() => null}
            />
            <div className="flex items-center justify-between mb-4">
                <Heading
                    title={title}
                    description={description}
                />
                {category && (
                    <Button
                        variant='destructive'
                        size='icon'
                        onClick={onDelete}
                    >
                        <Trash className="h-5 w-5" />
                    </Button>
                )}
            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-3 gap-3">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="category name"
                                            {...field}
                                        />
                                    </FormControl>
                                    {/* <FormDescription>
                                        This is Your display name
                                    </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="billboardId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Billboard</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Select A Billboard"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map((billboard) => {
                                                return (
                                                    <SelectItem
                                                        key={billboard.id}
                                                        value={billboard.id}
                                                    >
                                                        {billboard.label}
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} type="submit" >{action}</Button>
                </form>
            </Form>
            <Separator className="mb-6" />
        </>
    )
}