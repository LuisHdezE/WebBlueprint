import type { ReactNode } from 'react';

export type DataTableColumn<Row> = {
  id: string;
  header: string;
  cell: (row: Row) => ReactNode;
  align?: 'left' | 'right';
  className?: string;
};

export type DataTableProps<Row> = {
  rows: readonly Row[];
  columns: readonly DataTableColumn<Row>[];
  getRowId: (row: Row) => string;
  emptyMessage?: string;
  caption?: string;
};

export function DataTable<Row>({
  rows,
  columns,
  getRowId,
  emptyMessage = 'No hay registros para mostrar.',
  caption,
}: DataTableProps<Row>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-[720px] w-full border-collapse text-left text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.07em] text-slate-500">
          <tr>
            {columns.map((column) => (
              <th
                className={`px-4 py-3 ${column.align === 'right' ? 'text-right' : 'text-left'} ${column.className ?? ''}`}
                key={column.id}
                scope="col"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr className="transition hover:bg-slate-50/80" key={getRowId(row)}>
                {columns.map((column) => (
                  <td
                    className={`px-4 py-3 align-middle text-slate-600 ${column.align === 'right' ? 'text-right' : 'text-left'} ${column.className ?? ''}`}
                    key={column.id}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-10 text-center text-sm text-slate-500" colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
