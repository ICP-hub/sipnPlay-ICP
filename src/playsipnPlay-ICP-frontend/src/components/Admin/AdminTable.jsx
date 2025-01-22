import React from "react";

const AdminTable = ({ data, title }) => {

  function convertUTCToLocal(datetimeUTC) {
    const timestampMillis = datetimeUTC / 1000000n;
    const date = new Date(Number(timestampMillis));
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
  }

  return (
    <table className="min-w-full divide-y divide-gray-200 rounded-t-lg overflow-x-auto">
      <thead className="bg-stone-800 rounded-t-lg">
        <tr>
          {title.toLowerCase() === "users" && (
            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Sno.
            </th>
          )}
          <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
            Timestamp
          </th>
          {title.toLowerCase() !== "users" && (
            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
              Name
            </th>
          )}
          <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
            Email
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
            {title.toLowerCase() === "users" ? "Principal" : title}
          </th>
        </tr>
      </thead>
      <tbody className="bg-stone-700 text-black divide-y divide-gray-200 min-w-full">
        {data &&
          data.length > 0 &&
          data.map((item, index) => (
            <tr key={`data${index}`} className="min-w-full">
              {title.toLowerCase() === "users" && (
                <td className="px-4 py-4 text-stone-200">{item.number}</td>
              )}
              <td className="px-4 py-4 text-stone-200">{convertUTCToLocal(item.date)}</td>
              {title.toLowerCase() !== "users" && (
                <td className="px-4 py-4 text-stone-200">{item.name}</td>
              )}
              <td className="px-4 py-4 text-stone-200">{item.email}</td>
              {title.toLowerCase() === "principal" && (
                <td className="px-4 py-4 text-stone-200 truncate">
                  {item.icp_address}
                </td>
              )}
              {title.toLowerCase() === "messages" && (
                <td className="px-4 py-4 text-stone-200 truncate">
                  {item.message}
                </td>
              )}
              {title.toLowerCase() === "users" && (
                <td className="px-4 py-4 text-stone-200 truncate">
                  {item.id.toString()}
                </td>
              )}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default AdminTable;
