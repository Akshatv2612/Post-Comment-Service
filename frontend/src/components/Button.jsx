import React from "react";

export default function Button({
    children,
    type = "button",
    bgColor = "bg-blue-600",
    textColor = "text-white",
    className = "",
    padding = "py-4 px-2",
    ...props
}) {
    return (
        <button className={`rounded-lg ${bgColor} ${textColor} ${className} ${padding}`} {...props}>
            {children}
        </button>
    );
}