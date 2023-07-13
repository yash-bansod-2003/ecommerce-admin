"use client";
import * as z from "zod"
import { store } from "@prisma/client"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";

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
import { ApiAlert } from "@/components/ui/api-alert";


interface SettingsFormProps {
    store: store
}

const formSchema = z.object({
    name: z.string().min(2).max(50),
});

type SettingFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ store }) => {
    const params = useParams();
    const router = useRouter();

    const { toast } = useToast();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: store.name,
        },
    })

    async function onSubmit(values: SettingFormValues) {
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, values);
            router.refresh();
            toast({
                title: "store update successfully",
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
            await axios.delete(`/api/stores/${params.storeId}`);
            router.refresh();
            router.push('/');
            toast({
                variant: 'default',
                title: "store deleted",
            });
        } catch (error) {
            setLoading(false);
            toast({
                variant: 'destructive',
                title: "make sure your store is empty it will not contain any products and categories.",
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
                    title="Settings"
                    description="Manage Store Preferences"
                />
                <Button
                    variant='destructive'
                    size='icon'
                    onClick={onDelete}
                >
                    <Trash className="h-5 w-5" />
                </Button>
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
                                            placeholder="shoes"
                                            {...field}
                                        />
                                    </FormControl>
                                    {/* <FormDescription>
                                    This is your store name.
                                </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} type="submit" >Save Changes</Button>
                </form>
            </Form>
            <Separator className="my-4" />
            <ApiAlert
                title="NEXT_PUBLIC_API_URL"
                description={`${origin}/api/${params.storeId}`}
                variant="public"
            />
        </>
    )
}