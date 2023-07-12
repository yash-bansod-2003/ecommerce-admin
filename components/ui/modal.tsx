"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface ModalProps {
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, description, isOpen, onClose, children }: ModalProps) => {
    /* 
    The Custom onChange function receive a argument a state whether a dialog is currently open or not
    and what i say here if open is false so trigger my custom function onClose which may be a function of state management library like zustand and redux
    */
    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        {children}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export { Modal };