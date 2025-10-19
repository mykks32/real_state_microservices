import React from "react";

const RootSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 p-4 space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="w-3/4 h-12 bg-neutral-800 rounded-xl" />

            {/* Main content blocks */}
            <div className="w-full max-w-4xl space-y-4">
                <div className="h-6 w-1/2 bg-neutral-800 rounded" />
                <div className="h-48 w-full bg-neutral-800 rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="h-32 bg-neutral-800 rounded-xl" />
                    <div className="h-32 bg-neutral-800 rounded-xl" />
                    <div className="h-32 bg-neutral-800 rounded-xl" />
                </div>
            </div>

            {/* Footer skeleton */}
            <div className="w-1/2 h-6 bg-neutral-800 rounded" />
        </div>
    );
};

export default RootSkeleton;