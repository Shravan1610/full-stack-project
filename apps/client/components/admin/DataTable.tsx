import React from 'react';

type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  page: number;
  pageSize: number;
  total?: number;
  onPageChange?: (page: number) => void;
};

export default function DataTable<T>({ columns, data, page, pageSize, total, onPageChange }: Props<T>) {
  const totalPages = total ? Math.ceil(total / pageSize) : undefined;

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, idx) => (
            <tr key={row.id || idx} className="border-t">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 align-top">
                  {c.render ? c.render(row) : (row as any)[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages !== undefined && (
        <div className="flex items-center justify-between px-4 py-2 border-t">
          <div className="text-xs text-gray-500">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange && onPageChange(Math.max(1, page - 1))}
              className="px-3 py-1 bg-white border rounded disabled:opacity-50"
              disabled={page <= 1}
            >
              Prev
            </button>
            <button
              onClick={() => onPageChange && onPageChange(Math.min(totalPages, page + 1))}
              className="px-3 py-1 bg-white border rounded disabled:opacity-50"
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
