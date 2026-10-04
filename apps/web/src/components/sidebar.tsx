"use client";

import {
  AddressBookIcon,
  ChartBarIcon,
  ClockCounterClockwiseIcon,
  GearSixIcon,
  HouseIcon,
  type Icon,
  PackageIcon,
  ReceiptIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

type NavItem = { href: string; label: string; icon: Icon };

const mainNav: NavItem[] = [
  { href: "", label: "Overview", icon: HouseIcon },
  { href: "/sales", label: "Sales", icon: ReceiptIcon },
  { href: "/purchases", label: "Purchases", icon: ShoppingCartIcon },
  { href: "/parties", label: "Parties", icon: AddressBookIcon },
  { href: "/items", label: "Items", icon: PackageIcon },
  { href: "/reports", label: "Reports", icon: ChartBarIcon },
  { href: "/activity", label: "Activity", icon: ClockCounterClockwiseIcon },
];

const manageNav: NavItem[] = [
  { href: "/staff", label: "Staff", icon: UsersIcon },
  { href: "/settings", label: "Settings", icon: GearSixIcon },
];

export function Sidebar({
  shopCode,
  isSuperAdmin,
}: {
  shopCode: string;
  isSuperAdmin: boolean;
}) {
  const pathname = usePathname();
  const base = `/s/${shopCode}`;

  function NavLink({ item }: { item: NavItem }) {
    const href = `${base}${item.href}`;
    const active =
      item.href === "" ? pathname === base : pathname.startsWith(href);
    const ItemIcon = item.icon;

    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
          active
            ? "bg-primary/10 text-primary"
            : "text-muted hover:bg-background hover:text-foreground",
        )}
      >
        <ItemIcon size={20} weight={active ? "fill" : "regular"} />
        {item.label}
      </Link>
    );
  }

  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      <p className="px-3 pb-4 pt-2 font-display text-xl font-semibold">
        KeralaBooks
      </p>
      {mainNav.map((item) => (
        <NavLink key={item.label} item={item} />
      ))}
      <div className="my-3 border-t border-border" />
      {manageNav.map((item) => (
        <NavLink key={item.label} item={item} />
      ))}
            {isSuperAdmin && (
        <Link href="/admin" className="mt-auto rounded-lg px-3 py-2 text-sm text-muted transition hover:text-foreground">
          ← Admin console
        </Link>
      )}
    </nav>
  );
}
