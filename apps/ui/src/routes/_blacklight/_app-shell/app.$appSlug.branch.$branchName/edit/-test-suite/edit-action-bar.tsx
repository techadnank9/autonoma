import { Button } from "@autonoma/blacklight";
import { useNavigate } from "@tanstack/react-router";
import { useDiscardEdit, useEditSession, useFinalizeEdit } from "lib/query/snapshot-edit.queries";
import { Route } from "..";

export function EditActionBar({ branchId }: { branchId: string }) {
  const { appSlug, branchName } = Route.useParams();
  const { data: session } = useEditSession(branchId);
  const navigate = useNavigate();

  const finalizeEdit = useFinalizeEdit();
  const discardEdit = useDiscardEdit();

  const navigateBack = () => {
    void navigate({ to: "/app/$appSlug/branch/$branchName/tests", params: { appSlug, branchName } });
  };

  const isActing = finalizeEdit.isPending || discardEdit.isPending;

  return (
    <div className="mt-4 flex items-center justify-between border-t border-border-mid pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => discardEdit.mutate({ branchId }, { onSuccess: navigateBack })}
        disabled={isActing}
      >
        {discardEdit.isPending ? "Discarding..." : "Discard"}
      </Button>

      <Button
        size="sm"
        onClick={() => finalizeEdit.mutate({ branchId }, { onSuccess: navigateBack })}
        disabled={session.hasIncompleteGenerations || isActing}
      >
        {finalizeEdit.isPending ? "Committing..." : "Commit"}
      </Button>
    </div>
  );
}
