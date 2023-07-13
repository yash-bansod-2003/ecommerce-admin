"use client";

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Copy, Server } from 'lucide-react';
import { Badge, BadgeProps } from "@/components/ui/badge"
import { Button } from './button';
import { useToast } from './use-toast';

export function BadgeDemo() {
    return <Badge>Badge</Badge>
}

interface ApiAlertProps {
    title: string;
    description: string;
    variant: "public" | "admin";
}


/* Safe Objects With Typescript */
const textMap: Record<ApiAlertProps["variant"], string> = {
    public: 'public',
    admin: 'admin',
}

const variantMap: Record<ApiAlertProps['variant'], BadgeProps["variant"]> = {
    public: 'secondary',
    admin: 'destructive',
}



export const ApiAlert: React.FC<ApiAlertProps> = ({ description, title, variant = "public" }) => {
    const { toast } = useToast();

    const onCopy = (description: string) => {
        navigator.clipboard.writeText(description);
        toast({
            title: 'Api Route Copied to Clipboard'
        })
    }

    return (
        <Alert>
            <Server className='h-5 w-5' />
            <AlertTitle className='flex items-center gap-4'>
                {title}
                <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
            </AlertTitle>
            <AlertDescription className='mt-4 flex items-center justify-between'>
                <code className='relative bg-muted rounded px-2 py-1 text-sm font-semibold'>
                    {description}
                </code>
                <Button
                    variant='outline'
                    size='icon'
                    onClick={() => onCopy(description)}
                >
                    <Copy className='h-5 w-5' />
                </Button>
            </AlertDescription>
        </Alert>
    )
}