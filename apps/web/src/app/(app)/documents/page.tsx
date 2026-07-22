import { Wip } from "@/components/app/wip";

export const metadata = { title: "Documents" };

export default function DocumentsPage() {
  return (
    <Wip
      title="Evidence vault"
      note="Securely upload and manage supporting documents (management accounts, bank statements, forecasts). Files are stored in Cloudflare R2 via presigned uploads."
    />
  );
}
