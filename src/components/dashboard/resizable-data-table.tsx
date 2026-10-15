"use client";

import { useCallback, useMemo, useState } from "react";

export type DataTableColumn<T> = {
  id: string;
  header: string;
  width?: number;
  minWidth?: number;
  cell: (row: T) => React.ReactNode;
};

type Props<T> = {
  rows: T[];
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string;
  className?: string;
};

export function ResizableDataTable<T>({
  rows,
  columns,
  rowKey,
  className,
}: Props<T>) {
  const [widths, setWidths] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const col of columns) {
      initial[col.id] = col.width ?? 120;
    }
    return initial;
  });

  const onResizeStart = useCallback(
    (columnId: string, minWidth: number, startX: number) => {
      const startWidth = widths[columnId] ?? 120;

      const onMove = (e: MouseEvent) => {
        const next = Math.max(minWidth, startWidth + (e.clientX - startX));
        setWidths((prev) => ({ ...prev, [columnId]: next }));
      };

      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [widths]
  );

  const totalMin = useMemo(
    () => columns.reduce((sum, c) => sum + (c.minWidth ?? 72), 0),
    [columns]
  );

  return (
    <div
      className={`overflow-x-auto rounded-2xl border bg-card ${className ?? ""}`}
    >
      <table
        className="w-full text-sm table-fixed"
        style={{ minWidth: totalMin }}
      >
        <thead>
          <tr className="border-b bg-muted/30">
            {columns.map((col) => {
              const w = widths[col.id] ?? col.width ?? 120;
              const minW = col.minWidth ?? 72;
              return (
                <th
                  key={col.id}
                  className="relative p-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  style={{ width: w, minWidth: minW }}
                >
                  <span className="block truncate pr-2">{col.header}</span>
                  <span
                    role="separator"
                    aria-orientation="vertical"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onResizeStart(col.id, minW, e.clientX);
                    }}
                    className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-primary/20"
                  />
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b last:border-b-0 hover:bg-primary/[0.02]"
            >
              {columns.map((col) => {
                const w = widths[col.id] ?? col.width ?? 120;
                return (
                  <td
                    key={col.id}
                    className="p-3 align-middle overflow-hidden"
                    style={{ width: w, maxWidth: w }}
                  >
                    <div className="truncate">{col.cell(row)}</div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
