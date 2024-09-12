import React from "react";
import { convertNanosecondsToDateTime } from "../../../../sipnPlay-ICP-frontend/src/utils/helpers";

const AdminTable = ({ data, title }) => {
  console.log(data);
  return (
    <table className="min-w-full divide-y divide-gray-200 rounded-t-lg">
      <thead className="bg-stone-800 rounded-t-lg">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
            Timestamp
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
            Email
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
            {title}
          </th>
        </tr>
      </thead>
      <tbody className="bg-stone-700 text-black divide-y divide-gray-200 min-w-full">
        {data &&
          data.length > 0 &&
          data.map((item, index) => (
            <tr key={`data${index}`} className="min-w-full">
              <td className="px-6 py-4 whitespace-nowrap text-stone-200">
                {convertNanosecondsToDateTime(item.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-stone-200">
                {item.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-stone-200">
                {item.email}
              </td>
              {title.toLowerCase() === "principal" && (
                <td className="px-6 py-4 whitespace-nowrap text-stone-200">
                  {item.icpAddress}
                </td>
              )}
              {title.toLowerCase() === "messages" && (
                <td className="px-6 py-4 whitespace-nowrap text-stone-200">
                  {item.message}
                </td>
              )}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default AdminTable;
