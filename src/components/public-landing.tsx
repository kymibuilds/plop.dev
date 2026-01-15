import Link from "next/link";
import { CenteredLayout } from "./centered-layout";

export function PublicLanding() {
  return (
    <CenteredLayout>
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-xl font-medium">sproink</h1>
        <p className="text-sm text-muted-foreground">
          link in bio for developers
        </p>

        <div className="flex gap-3 text-sm">
          <Link href="/login" className="hover:underline">
            sign in
          </Link>
          <span className="text-muted-foreground">·</span>
          <Link href="/signup" className="hover:underline">
            sign up
          </Link>
        </div>
      </div>
    </CenteredLayout>
  );
}
