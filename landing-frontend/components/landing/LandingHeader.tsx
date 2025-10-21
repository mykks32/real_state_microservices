import clsx from "clsx";
import Link from "next/link";
import useAuthStore from "@/stores/useAuthStore";
import {useState} from "react";

interface ILandingHeaderProps {
    scrolled: boolean;
}

const LandingHeader = ({scrolled}: ILandingHeaderProps) => {
    const user = useAuthStore((state) => state.user);
    const [menuOpen, setMenuOpen] = useState(false);

    const links = [
        ["About", "/about"],
        ["Contact", "/contact"],
        ["Properties", "/find"],
        ...(!user
            ? [
                ["Login", "/login"],
                ["Sign up", "/signup"],
            ]
            : []),
    ];

    return (
        <header
            className={clsx(
                "fixed z-10 top-0 w-screen h-[80px] md:h-[120px]",
                {"shadow-lg": scrolled}
            )}
        >
            <div
                className={clsx("transition-all absolute", {
                    "left-4 md:left-1/2 top-4 translate-x-0 md:-translate-x-1/2":
                    scrolled,
                    "left-1/2 top-72 -translate-x-1/2": !scrolled,
                })}
            >
                <h1
                    className={clsx(
                        "font-bold tracking-widest transition",
                        {
                            "text-red-500 text-5xl": scrolled,
                            "text-theme-1 text-6xl md:text-8xl": !scrolled,
                        }
                    )}
                >
                    RealState
                </h1>
                <p
                    className={clsx(
                        "tracking-widest text-center transition absolute left-1/2 -translate-x-1/2 whitespace-nowrap md:text-sm",
                        {
                            "hidden opacity-0 pointer-events-none": scrolled,
                            "opacity-100": !scrolled,
                        }
                    )}
                >
                    Stop dreaming. Start finding
                </p>
            </div>

            <nav
                className={clsx(
                    "absolute left-1/2 transform -translate-x-1/2 transition-all",
                    scrolled ? "top-[75px]" : "top-8"
                )}
            >
                {/* Large screens: always visible */}
                <ul className="hidden md:flex gap-6 text-gray-600 text-base">
                    {links.map(([title, url], index) => (
                        <li key={index} className="transition hover:opacity-70 whitespace-nowrap">
                            <Link href={url}>{title}</Link>
                        </li>
                    ))}
                </ul>

                {/* Medium screens: show only when scrolled, hide on small */}
                {scrolled && (
                    <ul className="hidden md:flex lg:hidden gap-6 text-gray-600 text-base">
                        {links.map(([title, url], index) => (
                            <li key={index} className="transition hover:opacity-70 whitespace-nowrap">
                                <Link href={url}>{title}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </nav>

            {/* Mobile Menu Toggle - Always at right side */}
            <button
                className="md:hidden fixed right-7 top-[28px]"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Toggle Menu"
            >
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
                        className={clsx(
                            "transition",
                            menuOpen && "opacity-0"
                        )}
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

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 shadow-lg">
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
                    </nav>
                </div>
            )}
        </header>
    );
};

export default LandingHeader;