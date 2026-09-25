export default function UnauthorisedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
      <h1 className="font-display text-2xl font-semibold">
        Admin access required
      </h1>
      <p className="max-w-sm text-muted-foreground">
        Your account doesn&apos;t have permission to use the Sadora-Lens admin
        console. Contact a super admin if you believe this is an error.
      </p>
    </div>
  );
}
