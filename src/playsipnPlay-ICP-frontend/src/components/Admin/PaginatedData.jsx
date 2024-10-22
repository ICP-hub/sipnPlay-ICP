import React from "react";
import AdminTable from "./AdminTable";

const PaginatedData = ({ title, data, handlePrev, handleNext }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="bg-stone-900 shadow-md rounded-lg overflow-hidden">
        <AdminTable data={data} title={title} />
        {/* <div className="flex justify-between mt-4">
          <button
            onClick={handlePrev}
            className="px-4 py-2 m-3 bg-[#EE3EC9] text-white rounded-lg"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 m-3 bg-[#EE3EC9] text-white rounded-lg"
          >
            Next
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default PaginatedData;
