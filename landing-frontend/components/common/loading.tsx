"use client";

import React, { FC } from "react";

const Loading: FC<{ message?: string }> = ({ message = "Loading..." }) => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 z-50">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-700 text-sm">{message}</p>
        </div>
    );
};

export default Loading;