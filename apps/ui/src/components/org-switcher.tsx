import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useAuthClient } from "../lib/auth";
import {
  organizationsQueryOptions,
  sessionQueryOptions,
  useOrganizations,
  useSession,
} from "../lib/query/auth.queries";

export function OrgSwitcher() {
  const authClient = useAuthClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: organizations } = useOrganizations();
  const { data: session } = useSession();

  const activeOrgId = session?.session.activeOrganizationId;

  async function handleSwitch(organizationId: string) {
    await authClient.organization.setActive({ organizationId });
    void queryClient.invalidateQueries({ queryKey: sessionQueryOptions().queryKey });
    void queryClient.invalidateQueries({ queryKey: organizationsQueryOptions().queryKey });
    await router.invalidate();
  }

  if (organizations == null || organizations.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label htmlFor="org-switcher">Organization:</label>
      <select
        id="org-switcher"
        value={activeOrgId ?? ""}
        onChange={(e) => {
          if (e.target.value !== "") {
            void handleSwitch(e.target.value);
          }
        }}
      >
        <option value="" disabled>
          Select organization
        </option>
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
    </div>
  );
}
