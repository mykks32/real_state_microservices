import clsx from "clsx";
import FadeInDiv from "../common/FadeInDiv";

interface ILandingSection {
    reverse: boolean;
    title: string;
    phrases: string[];
    image: string;
    imageAlt: string;
}

const LandingSection = ({
    reverse,
    title,
    phrases,
    image,
    imageAlt,
}: ILandingSection) => {
    return (
        <FadeInDiv
            className={clsx(
                "flex justify-between items-center gap-4 lg:flex-col",
                {
                    "flex-row-reverse": reverse,
                    "flex-row": !reverse,
                }
            )}
        >
            <div>
                {/* Title */}
                <h2 className="font-bold text-red-500 text-xl sm:text-lg md:text-base lg:text-lg">
                    {title}
                </h2>

                {/* List */}
                <ul className="font-bold text-gray-500 text-lg sm:text-base md:text-sm lg:text-base p-6 sm:p-3 flex flex-col gap-4">
                    {phrases.map((phrase, index) => (
                        <li
                            key={index}
                            className={clsx("whitespace-nowrap", {
                                "pl-2 sm:pl-2 md:pl-4 lg:pl-4": index === 1,
                                "pl-4 sm:pl-4 md:pl-6 lg:pl-8": index === 2,
                                "pl-8 sm:pl-6 md:pl-10 lg:pl-12": index === 3,
                            })}
                        >
                            {phrase}
                        </li>
                    ))}
                </ul>
            </div>

            <img
                src={`./images/${image}`}
                alt={imageAlt}
                className="drop-shadow-2xl w-[400px] lg:w-[60%]"
            />
        </FadeInDiv>
    );
};

export default LandingSection;
