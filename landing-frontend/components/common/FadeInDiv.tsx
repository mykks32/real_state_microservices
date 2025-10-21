import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

interface IFadeInDivProps {
    children: React.ReactNode;
    className: string | null;
}

const FadeInDiv = ({ children, className }: IFadeInDivProps) => {
    const domRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        if (!domRef) return;

        const observer = new IntersectionObserver(
            (entries) => {
                setVisible(entries[0].isIntersecting);
            },
            {
                threshold: 0.2,
            }
        );

        observer.observe(domRef.current!);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={domRef}
            className={clsx(
                {
                    "opacity-100 visible": visible,
                    "opacity-0 invisible": !visible,
                },
                className
            )}
            style={{ transition: "all 1s ease" }}
        >
            {children}
        </div>
    );
};

export default FadeInDiv;
