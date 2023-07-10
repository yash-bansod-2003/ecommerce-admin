"use client"

import { Modal } from "@/components/ui/modal";

import { UserButton } from "@clerk/nextjs";
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UserButton afterSignOutUrl='/' />
      <Modal
        title="Hello"
        description="Hello description from test"
        isOpen
        onClose={() => null}
      />
    </main>
  )
}
