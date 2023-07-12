"use client"
import { useState, useEffect } from "react";
import { StoreModal } from "@/components/modals/store-modal";
import { UserButton } from "@clerk/nextjs";
import { useStoreModal } from "@/hooks/use-store-modal";

export default function Home() {

  const isOpen = useStoreModal(state => state.isOpen);
  const onOpen = useStoreModal(state => state.onOpen);

  /*protect from hydration error */
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  /* We want default behavior */
  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  if (!isMounted) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Root Page
    </main>
  );
}
