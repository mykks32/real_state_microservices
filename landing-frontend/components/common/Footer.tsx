import Link from "next/link";

const Footer = () => {
    return (
        <footer className="flex py-8 justify-center items-center gap-4 text-sm">
            <Link href="/about" className="transition hover:opacity-70">
                About
            </Link>
            <span className="w-1 h-1 bg-black block rounded-full"></span>
            <Link href="/contact" className="transition hover:opacity-70">
                Contact
            </Link>
            <span className="w-1 h-1 bg-black block rounded-full"></span>
            <Link href="/privacy-policy" className="transition hover:opacity-70">
                Privacy Policy
            </Link>
        </footer>
    );
};

export default Footer;
