import React from "react";
import AdminTable from "./AdminTable";

const PaginatedData = ({ title, data }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="bg-stone-900 shadow-md rounded-lg overflow-hidden">
        <AdminTable data={data} title={title} />
      </div>
    </div>
  );
};

export default PaginatedData;
