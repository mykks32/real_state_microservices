import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
    return (
        <div className="flex flex-col justify-center items-center h-screen w-full gap-4 bg-gray-50">
            <Spinner className="w-12 h-12 text-blue-500" />
            <p className="text-lg font-medium text-gray-700">Loading, please wait...</p>
        </div>
    );
}