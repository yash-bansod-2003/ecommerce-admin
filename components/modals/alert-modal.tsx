import { useEffect, useState } from "react";
import { Modal } from "../ui/modal"
import { Button } from "../ui/button";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}


export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen, loading, onClose, onConfirm
}) => {
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            title="Are You Sure ?"
            description="This will delete you store and all data."
            onClose={onClose}
        >
            <div className="flex items-center justify-end pt-6 gap-6 w-full">
                <Button variant='outline' disabled={loading}> Conform</Button>
                <Button variant='default' disabled={loading}> Cancel</Button>
            </div>
        </Modal>
    )
}