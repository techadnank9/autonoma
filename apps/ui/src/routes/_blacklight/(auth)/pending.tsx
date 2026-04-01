import { Button, Logo } from "@autonoma/blacklight";
import { createFileRoute } from "@tanstack/react-router";
import { useAuthClient } from "lib/auth";

export const Route = createFileRoute("/_blacklight/(auth)/pending")({
  component: PendingPage,
});

function PendingPage() {
  const authClient = useAuthClient();

  return (
    <div className="flex h-full items-center justify-center bg-surface-void">
      <div className="flex max-w-md flex-col items-center px-6 text-center">
        <Logo variant="symbol" className="mb-8 size-12" />
        <h1 className="text-2xl font-medium text-text-primary">Access Pending</h1>
        <p className="mt-3 font-mono text-sm text-text-secondary">
          Your organization is pending approval. You'll be notified once access is granted.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            void authClient.signOut();
          }}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
