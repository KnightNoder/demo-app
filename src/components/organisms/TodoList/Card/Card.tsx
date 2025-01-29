import React, { useState, useRef } from "react";
import { FiMaximize, FiMoreVertical, FiMinimize, FiX } from "react-icons/fi";

interface DraggableCardProps {
  showDelete?: boolean;
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  showDelete = false,
}) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 300, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isResizing = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isResizing.current || isModal) return;
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = "grabbing";

    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX - startX, y: e.clientY - startY });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      setIsDragging(false);
      document.body.style.cursor = "default";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const toggleExpandCollapse = () => setIsCollapsed(!isCollapsed);

  const openAsModal = () => setIsModal(true);
  const closeModal = () => setIsModal(false);

  return (
    <>
      {isModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white shadow-lg rounded-lg p-4 w-2/3 h-3/4 relative">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold">Card Title</h2>
              <button onClick={closeModal}>
                <FiX className="text-xl" />
              </button>
            </div>
            <div className="p-4 overflow-auto">Expanded Modal Content</div>
          </div>
        </div>
      )}

      <div
        className="absolute bg-white shadow-lg rounded-lg border border-gray-200"
        style={{
          width: isCollapsed ? "300px" : `${size.width}px`,
          height: isCollapsed ? "50px" : `${size.height}px`,
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? "grabbing" : "default",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b">
          <span className="font-semibold">Card Title</span>
          <div className="flex gap-2">
            <button onClick={toggleExpandCollapse}>
              {isCollapsed ? <FiMaximize /> : <FiMinimize />}
            </button>
            <button onClick={openAsModal}>
              <FiMaximize />
            </button>
            <button onClick={() => setShowMenu(!showMenu)}>
              <FiMoreVertical />
            </button>
          </div>
        </div>

        {!isCollapsed && <div className="p-4">Draggable Card Content</div>}

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-2 border-t bg-gray-100 text-sm text-center">
            Footer Content
          </div>
        )}

        {/* Kebab Menu */}
        {showMenu && (
          <div className="absolute right-4 top-12 bg-white shadow-lg rounded-lg border p-2">
            <button className="block w-full text-left px-4 py-1 hover:bg-gray-200">
              Export
            </button>
            <button className="block w-full text-left px-4 py-1 hover:bg-gray-200">
              Print
            </button>
            <button className="block w-full text-left px-4 py-1 hover:bg-gray-200">
              Share
            </button>
            {showDelete && (
              <button className="block w-full text-left px-4 py-1 text-red-600 hover:bg-red-100">
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default DraggableCard;
