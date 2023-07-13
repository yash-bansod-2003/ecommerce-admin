"use client";
import * as z from "zod"
import { billboard } from "@prisma/client"
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
import { ImageUpload } from "@/components/ui/image-upload";


interface BillboardFormProps {
    billboard: billboard | null;
}

const formSchema = z.object({
    label: z.string().min(2).max(50),
    imageURL: z.string().min(2)
});

type BillboardFormValues = z.infer<typeof formSchema>;

export const BillboardForm: React.FC<BillboardFormProps> = ({ billboard }) => {
    const params = useParams();
    const router = useRouter();

    const { toast } = useToast();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const title = billboard ? "Edit Billboard" : "Create Billboard";
    const description = billboard ? "edit a billboard" : "add a new billboard";
    const toastMessage = billboard ? "edit billboard successfully" : "create billboard successfully";
    const action = billboard ? "save changes" : "create";


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: billboard?.label || "",
            imageURL: billboard?.imageURL || ""
        },
    })

    async function onSubmit(values: BillboardFormValues) {
        try {
            setLoading(true);
            await axios.patch(`/api/billboards/${params.billboardId}`, values);
            router.refresh();
            toast({
                title: "billboard update successfully",
            })
        } catch (error) {
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
            await axios.delete(`/api/billboards/${params.billboardId}`);
            router.refresh();
            router.push('/');
            toast({
                variant: 'default',
                title: "billboard deleted",
            });
        } catch (error) {
            setLoading(false);
            toast({
                variant: 'destructive',
                title: "make sure your billboard is empty it will not contain any products and categories.",
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
                {billboard && (
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
                        name="imageURL"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        disabled={loading}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange("")}
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
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="label"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is Your display name
                                    </FormDescription>
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