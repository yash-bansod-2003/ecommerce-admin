"use client";
import * as z from "zod"
import { billboard, category, color, image, product, size } from "@prisma/client"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ImageUpload } from "@/components/ui/image-upload";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { url } from "inspector";
import Link from "next/link";

interface ProductFormProps {
    product: product & { images: Array<image> } | null;
    sizes: Array<size>;
    categories: Array<category>;
    colors: Array<color>;
}

const formSchema = z.object({
    name: z.string().min(1).max(25),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC<ProductFormProps> = ({ product, sizes, categories, colors }) => {
    const params = useParams();
    const router = useRouter();

    const { toast } = useToast();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const title = product ? "Edit Product" : "Create Product";
    const description = product ? "edit a Product" : "add a new Product";
    const toastMessage = product ? "edit Product successfully" : "create Product successfully";
    const action = product ? "save changes" : "create";


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: product ? {
            ...product,
            price: parseFloat(String(product?.price)),
        } : {
            name: "",
            images: [],
            price: 0,
            categoryId: "",
            colorId: "",
            sizeId: "",
        }
    })

    async function onSubmit(values: ProductFormValues) {

        console.log(values);


        try {
            setLoading(true);
            if (product) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, values);
            }
            else {
                await axios.post(`/api/${params.storeId}/products`, values);
            }
            router.push(`/${params.storeId}/products`);
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push('/');
            toast({
                variant: 'default',
                title: "product deleted",
            });
        } catch (error) {
            setLoading(false);
            toast({
                variant: 'destructive',
                title: "make sure your product is empty it will not contain associated items.",
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
                {product && (
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
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value.map(image => image.url)}
                                        disabled={loading}
                                        onChange={(url) => field.onChange([...field.value, { url }])}
                                        onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                    />
                                </FormControl>
                                {/* <FormDescription>
                                    This is your billboard name.
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                                            placeholder="Product Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={loading}
                                            placeholder="Product Price"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sizeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Select A Billboard"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes.map((item) => {
                                                return (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {item.name}
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Select A Billboard"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((item) => {
                                                return (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {item.name}
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="colorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Select A Billboard"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map((item) => {
                                                return (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {item.name}
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            //@ts-ignore
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Archived
                                        </FormLabel>
                                        <FormDescription>
                                            This product will not appear anywhere in the store
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            //@ts-ignore
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Featured
                                        </FormLabel>
                                        <FormDescription>
                                            This product will appear on the home page
                                        </FormDescription>
                                    </div>
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