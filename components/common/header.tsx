"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import NavLink from "./nav-link";
import { cn } from "@/lib/utils";
import {  Show, SignInButton, UserButton } from '@clerk/nextjs'


const hoverUnderline =
  "relative text-slate-900 after:absolute after:left-1/2 after:-bottom-1 after:h-[2px] after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full";

export default function Header({ planBadge }: { planBadge?: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-2 left-0 right-0 z-50">
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between px-4 py-2 transition-all duration-300",
          scrolled
            ? "mt-3 rounded-full dark:bg-[#10112A] bg-white/80 backdrop-blur-md shadow-md shadow-black/5 border-b-2 border-indigo-400"
            : "bg-transparent",
        )}
      >
        {/* Logo */}
        <NavLink
          href="/"
          className="flex dark:text-blue-200/80 items-center gap-2 text-xl font-semibold text-slate-900 hover:text-black"
        >
          <Image
            src="/logo.png"
            alt="Summarix"
            width={35}
            height={35}
            className="transition-transform dark:invert duration-300 hover:rotate-6"
          />
          Summarix
        </NavLink>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-40">
          <NavLink
            href="/#pricing"
            className={cn(
              "text-xl font-medium text-slate-900 dark:text-blue-200/80",
              hoverUnderline,
            )}
          >
            Pricing
          </NavLink>
          <Show when="signed-in">
            <NavLink
              href="/dashboard"
              className={cn(
                "text-xl font-medium text-slate-900 dark:text-blue-200/80",
                hoverUnderline,
              )}
            >
              Your Summaries
            </NavLink>
          </Show>
        </div>

        {/* Right */}
        <Show when="signed-in">
          <div className="flex items-center gap-2">
            <NavLink
              href="/upload"
              className={cn(
                "text-xl font-medium text-slate-900 dark:text-blue-200/80 transition-colors mr-7",
                hoverUnderline,
              )}
            >
              Upload a PDF
            </NavLink>
            {planBadge}
            <UserButton />
          </div>
        </Show>
        <Show when="signed-out">
          <div className="flex items-center gap-6">
            <NavLink
              href="/sign-in"
              className={cn(
                "text-xl font-medium text-slate-900 dark:text-blue-200/80 transition-colors",
                hoverUnderline,
              )}
            >
              Sign In
            </NavLink>
          </div>
        </Show>
      </nav>
    </header>
  );
}
