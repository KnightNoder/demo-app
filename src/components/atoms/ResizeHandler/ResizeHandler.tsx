import React from "react";

interface ResizeHandleProps {
    direction: "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
    onMouseDown: (e: React.MouseEvent, direction: string) => void;
    className: string;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ direction, onMouseDown, className }) => {
    return (
        <div
            className={`absolute ${className}`}
            onMouseDown={(e) => onMouseDown(e, direction)}
        />
    );
};

export default ResizeHandle;
