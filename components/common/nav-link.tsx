"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function NavLink({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  const pathName = usePathname();
  const isActive =
    pathName === href || (href !== "/" && pathName.startsWith(href));
  return (
    <Link
      href={href}
      className={cn(
        "hover:text-black transition-colors duration-100  font-sans font-medium text-[18px]",
        { "text-indigo-600": isActive },
        className
      )}
    >
      {children}
    </Link>
  );
}
