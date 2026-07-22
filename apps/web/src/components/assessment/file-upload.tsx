"use client";

import { useRef, useState } from "react";
import { Upload, FileCheck2, Loader2 } from "lucide-react";
import { cn } from "@capita/ui";
import { createUploadUrl, confirmUpload } from "@/app/(app)/assessment/actions";

interface Props {
  assessmentId: string;
  questionId: string;
  documentIds: string[];
  onChange: (documentIds: string[]) => void;
}

/** Direct browser → R2 upload for evidence, via presigned URL. */
export function FileUpload({ assessmentId, questionId, documentIds, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [names, setNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const added: string[] = [];
      const addedNames: string[] = [];
      for (const file of Array.from(files)) {
        const { url, key } = await createUploadUrl(
          assessmentId,
          file.name,
          file.type || "application/octet-stream",
        );
        const put = await fetch(url, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type || "application/octet-stream" },
        });
        if (!put.ok) throw new Error("Upload failed");
        const { id } = await confirmUpload({
          assessmentId,
          questionId,
          key,
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
          sizeBytes: file.size,
        });
        added.push(id);
        addedNames.push(file.name);
      }
      onChange([...documentIds, ...added]);
      setNames((n) => [...n, ...addedNames]);
    } catch {
      setError("Something went wrong uploading. Please try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-input px-4 py-5 text-sm text-muted-foreground transition-colors hover:border-brand hover:bg-accent",
          busy && "opacity-70",
        )}
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Upload className="size-4" />
        )}
        {busy ? "Uploading…" : "Upload evidence (PDF, images, spreadsheets)"}
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {names.length > 0 ? (
        <ul className="space-y-1">
          {names.map((n, i) => (
            <li
              key={`${n}-${i}`}
              className="flex items-center gap-2 text-xs text-success"
            >
              <FileCheck2 className="size-3.5" />
              {n}
            </li>
          ))}
        </ul>
      ) : documentIds.length > 0 ? (
        <p className="text-xs text-success">
          {documentIds.length} file(s) attached.
        </p>
      ) : null}

      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
