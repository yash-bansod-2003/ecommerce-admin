
"use client";

import { useState, useEffect } from "react";
import { StoreModal } from "@/components/modals/store-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    // This is a side effect that runs after the first render and sets the isMounted state to true
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // This is a conditional rendering that returns null if the component is not mounted yet
    if (!isMounted) {
        return null;
    }

    return (
        <>
            <StoreModal />
        </>
    )
}
