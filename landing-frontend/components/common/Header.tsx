"use client"
import clsx from "clsx";
import Link from "next/link";
import useAuthStore from "@/stores/useAuthStore";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {cn} from "@/lib/utils";

const Header = ({ className, ...props }: React.ComponentProps<"div">) => {
    const user = useAuthStore((state) => state.user);
    const [menuOpen, setMenuOpen] = useState(false);

    const links = [
        ["About", "/about"],
        ["Contact", "/contact"],
        ["Properties", "/find"],
    ];

    const userLinks = !user
        ? [
            ["Login", "/login"],
            ["Sign up", "/signup"],
        ]
        : [
            ["Dashboard", "/dashboard"]
        ];

    return (
        <>
            <header className={cn("relative", className)} {...props}>
                <section className="border border-b-1 border-slate-500/20 p-4">
                    <div>
                        <nav className="flex flex-row justify-between items-center">
                            <Link
                                href="/"
                                className="text-2xl md:text-3xl font-bold text-theme-1 tracking-widest"
                            >
                                RealState
                            </Link>

                            {/* Large screens */}
                            <ul className="hidden md:flex gap-8 text-gray-700 text-base font-medium">
                                {links.map(([title, url], index) => (
                                    <li key={index}
                                        className="transition hover:text-theme-1 hover:opacity-80 whitespace-nowrap">
                                        <Link href={url}>{title}</Link>
                                    </li>
                                ))}
                            </ul>

                            <div className="hidden md:flex gap-4 text-gray-700 text-base font-medium">
                                {userLinks.map(([title, url], index) => (
                                    <Link key={index} href={url}>
                                        <Button className="bg-blue-500 rounded-lg">{title}</Button>
                                    </Link>
                                ))}
                            </div>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden fixed right-7 top-[28px] z-50"
                            onClick={() => setMenuOpen((prev) => !prev)}
                            aria-label="Toggle Menu"
                        >
                            {/* SVG */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-menu"
                            >
                                <line
                                    x1="3"
                                    y1="6"
                                    x2="21"
                                    y2="6"
                                    className={clsx(
                                        "origin-left transition",
                                        menuOpen && "rotate-45 -translate-y-1"
                                    )}
                                />
                                <line
                                    x1="3"
                                    y1="12"
                                    x2="21"
                                    y2="12"
                                    className={clsx("transition", menuOpen && "opacity-0")}
                                />
                                <line
                                    x1="3"
                                    y1="18"
                                    x2="21"
                                    y2="18"
                                    className={clsx(
                                        "origin-left transition",
                                        menuOpen && "-rotate-45 translate-y-1"
                                    )}
                                />
                            </svg>
                        </button>

                        {/* Mobile Dropdown */}
                        {menuOpen && (
                            <div className="md:hidden top-full left-0 right-0 z-40">
                                <nav className="flex flex-col items-center py-4 gap-4">
                                    {links.map(([title, url], index) => (
                                        <Link
                                            key={index}
                                            href={url}
                                            onClick={() => setMenuOpen(false)}
                                            className="text-lg font-medium text-gray-600 hover:text-red-500 transition"
                                        >
                                            {title}
                                        </Link>
                                    ))}
                                    {userLinks.map(([title, url], index) => (
                                        <Link
                                            key={index}
                                            href={url}
                                            onClick={() => setMenuOpen(false)}
                                            className="text-lg font-medium text-gray-600 hover:text-red-500 transition"
                                        >
                                            {title}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        )}
                    </div>
                </section>

            </header>
            {/*/!* Spacer below fixed navbar *!/*/}
            <div className="pb-2 md:pb-4 lg:pb-8"></div>
        </>
    );
};

export default Header;