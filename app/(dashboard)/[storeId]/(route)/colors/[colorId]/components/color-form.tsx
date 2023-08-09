"use client";
import * as z from "zod"
import { color, size } from "@prisma/client"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";

import { AlertModal } from "@/components/modals/alert-modal";

import { Trash } from "lucide-react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";




interface ColorFormProps {
    color: color | null;
}

const formSchema = z.object({
    name: z.string().min(1).max(50),
    value: z.string().min(4).max(9).regex(/^#/, {
        message: 'color value must be a valid hex code'
    }),
});

type ColorFormValues = z.infer<typeof formSchema>;

export const ColorForm: React.FC<ColorFormProps> = ({ color }) => {
    const params = useParams();
    const router = useRouter();

    const { toast } = useToast();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const title = color ? "Edit Color" : "Create Color";
    const description = color ? "Edit a Color" : "Add a new Color";
    const toastMessage = color ? "Edit Color successfully" : "Create Color successfully";
    const action = color ? "save changes" : "create";


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: color?.name || "",
            value: color?.value || ""
        },
    })

    async function onSubmit(values: ColorFormValues) {

        try {
            setLoading(true);
            if (color) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, values);
            }
            else {
                await axios.post(`/api/${params.storeId}/colors`, values);
            }
            router.push(`/${params.storeId}/colors`);
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
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
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
                title: "Make sure your category is empty it will not associated with any Product.",
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
                {color && (
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
                                            placeholder="Color Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-4">
                                            <Input
                                                disabled={loading}
                                                placeholder="Color Value"
                                                {...field}
                                            />
                                            <div
                                                className="border p-4 rounded-full"
                                                style={{ backgroundColor: field.value }}
                                            />
                                        </div>
                                    </FormControl>
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