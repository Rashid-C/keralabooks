"use client";

import {
  AddressBookIcon,
  ArrowLeftIcon,
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
        aria-label={item.label}
        title={item.label}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition group-data-[collapsed=true]/sidebar:justify-center group-data-[collapsed=true]/sidebar:px-0",
          active
            ? "bg-primary/10 text-primary"
            : "text-muted hover:bg-background hover:text-foreground",
        )}
      >
        <ItemIcon size={20} weight={active ? "fill" : "regular"} />
        <span className="group-data-[collapsed=true]/sidebar:hidden">
          {item.label}
        </span>
      </Link>
    );
  }

  return (
    <nav className="flex h-full flex-col gap-1 overflow-hidden p-3 group-data-[collapsed=true]/sidebar:p-1.5">
      <p className="px-3 pb-4 pt-2 font-display text-xl font-semibold group-data-[collapsed=true]/sidebar:hidden">
        KeralaBooks
      </p>
      {mainNav.map((item) => (
        <NavLink key={item.label} item={item} />
      ))}
      <div className="my-3 border-t border-border group-data-[collapsed=true]/sidebar:my-2" />
      {manageNav.map((item) => (
        <NavLink key={item.label} item={item} />
      ))}
      {isSuperAdmin && (
        <Link
          href="/admin"
          aria-label="Admin console"
          title="Admin console"
          className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition hover:text-foreground group-data-[collapsed=true]/sidebar:justify-center group-data-[collapsed=true]/sidebar:px-0"
        >
          <ArrowLeftIcon size={20} />
          <span className="group-data-[collapsed=true]/sidebar:hidden">
            Admin console
          </span>
        </Link>
      )}
    </nav>
  );
}
