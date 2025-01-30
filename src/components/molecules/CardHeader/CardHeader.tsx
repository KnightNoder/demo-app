import React from "react";

const CardHeader = () => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md"
      // onClick={handleCloseModal}
    >
      <div
        // ref={modalRef}
        className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-2xl"
      >
        <div className="flex justify-between items-center border-b pb-2">
          <span className="font-semibold">Expanded Card</span>
          {/* <button onClick={() => setIsModalOpen(false)}>❌</button> */}
        </div>
        <div className="p-4">Modal Content</div>
      </div>
    </div>
  );
};

export default CardHeader;
