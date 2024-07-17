"use client"

import Link from "next/link";
import { CircleUser, Home, LineChart, Menu, Package2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "@/auth";
import { usePathname } from "next/navigation";

const SidebarElems = [
  {
    value: "Dashboard",
    icon: Home,
    path: "/dashboard",
  },
  {
    value: "Analytics",
    icon: LineChart,
    path: "/dashboard/analytics",
  },
];

export default function SidebarHeader() {
    const pathname = usePathname()
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Application</span>
            </Link>
            {SidebarElems.map((val) => (
              <Link
                href={val.path}
                className={`mx-[-0.65rem] ${
                  pathname == val.path && "bg-muted"
                } flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground`}
              >
                <val.icon className="h-5 w-5" />
                {val.value}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1"></div>
    </>
  );
}
