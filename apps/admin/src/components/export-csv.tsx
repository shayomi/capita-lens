"use client";

import { Download } from "lucide-react";
import { Button } from "@sadora/ui";

/** Client-side CSV export of a list of flat records. */
export function ExportCsv<T extends Record<string, unknown>>({
  rows,
  columns,
  filename,
}: {
  rows: T[];
  columns: { key: keyof T; label: string }[];
  filename: string;
}) {
  function download() {
    const escape = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const header = columns.map((c) => c.label).join(",");
    const body = rows
      .map((r) => columns.map((c) => escape(r[c.key])).join(","))
      .join("\n");
    const blob = new Blob([`${header}\n${body}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" size="sm" onClick={download} disabled={rows.length === 0}>
      <Download className="size-4" />
      Export CSV
    </Button>
  );
}
