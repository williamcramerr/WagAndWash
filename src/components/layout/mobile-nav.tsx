"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Calendar,
  Users,
  Dog,
  MoreHorizontal,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  ClipboardList,
  MapPin,
  CreditCard,
  BarChart3,
  UserCog,
  Settings,
  FileText,
  Clock,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const mobileNavItems: NavItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Pets", href: "/pets", icon: Dog },
];

const moreNavItems: NavItem[] = [
  { name: "Appointments", href: "/appointments", icon: ClipboardList },
  { name: "Routes", href: "/routes", icon: MapPin },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Waitlist", href: "/waitlist", icon: Clock },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Team", href: "/team", icon: UserCog },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = React.useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {mobileNavItems.map((item) => (
          <MobileNavLink
            key={item.href}
            item={item}
            isActive={pathname === item.href}
          />
        ))}
        <Drawer open={moreOpen} onOpenChange={setMoreOpen}>
          <DrawerTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
                "text-muted-foreground hover:text-foreground"
              )}
            >
              <MoreHorizontal className="h-5 w-5" />
              <span>More</span>
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Menu</DrawerTitle>
            </DrawerHeader>
            <div className="grid grid-cols-3 gap-4 p-4 pb-8">
              {moreNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 rounded-lg transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
}

interface MobileNavLinkProps {
  item: NavItem;
  isActive: boolean;
}

function MobileNavLink({ item, isActive }: MobileNavLinkProps) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <item.icon
        className={cn(
          "h-5 w-5 transition-transform",
          isActive && "scale-110"
        )}
      />
      <span>{item.name}</span>
      {isActive && (
        <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />
      )}
    </Link>
  );
}
