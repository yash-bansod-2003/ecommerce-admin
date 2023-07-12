"use client"

import { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from "../ui/modal"
import { useStoreModal } from '@/hooks/use-store-modal';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField } from '@/components/ui/form';
import axios from 'axios';
import { toast } from '../ui/use-toast';

const storeModalFormSchema = z.object({
    name: z.string().min(1)
})

export const StoreModal = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const storeModal = useStoreModal();

    const form = useForm<z.infer<typeof storeModalFormSchema>>({
        resolver: zodResolver(storeModalFormSchema),
        defaultValues: {
            name: ""
        }
    });

    const onSubmit = async (payload: z.infer<typeof storeModalFormSchema>) => {
        try {
            setLoading(true);
            const response = await axios.post('/api/stores', payload);
            /* we need to refresh page after creating a new store*/
            window.location.assign(`/${response.data?.id}`)
        } catch (error) {
            toast({
                variant: "destructive",
                title: "something went wrong",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            title="Create Store"
            description="Add a new store to create and manage products."
            isOpen={storeModal.isOpen}
            onClose={() => storeModal.onClose}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    <Button variant='outline' type='button' onClick={storeModal.onClose}>Cancel</Button>
                    <Button disabled={loading} type="submit" className='ml-4'>Continue</Button>
                </form>
            </Form>
        </Modal>
    )
}