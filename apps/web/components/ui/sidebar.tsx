"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { PanelLeftIcon } from "lucide-react"

/* ================== CONTEXT ================== */

type SidebarContextProps = {
  open: boolean
  setOpen: (open: boolean) => void
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

export function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used inside SidebarProvider")
  return ctx
}

/* ================== PROVIDER ================== */

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(true) // 👈 open by default

  const toggleSidebar = React.useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleSidebar }}>
      <div className="flex min-h-screen w-full">{children}</div>
    </SidebarContext.Provider>
  )
}

/* ================== SIDEBAR ================== */

export function Sidebar({
  side = "left",
  children,
}: {
  side?: "left" | "right"
  children: React.ReactNode
}) {
  const { open, setOpen } = useSidebar()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side={side}
        className="w-[18rem] p-0 bg-sidebar text-sidebar-foreground [&>button]:hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Sidebar</SheetTitle>
          <SheetDescription>Sidebar</SheetDescription>
        </SheetHeader>

        <div className="flex h-full w-full flex-col">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}

/* ================== TRIGGER ================== */

export function SidebarTrigger({
  className,
}: {
  className?: string
}) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className={cn(className)}
    >
      <PanelLeftIcon />
    </Button>
  )
}

/* ================== PARTS ================== */

export function SidebarHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("p-3 font-bold text-lg", className)} {...props} />
  )
}

export function SidebarContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex-1 overflow-auto p-2", className)}
      {...props}
    />
  )
}

export function SidebarFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("p-2 border-t", className)} {...props} />
  )
}

export function SidebarInput(props: React.ComponentProps<typeof Input>) {
  return <Input {...props} />
}