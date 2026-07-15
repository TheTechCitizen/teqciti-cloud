import { computed, watchEffect } from 'vue';
import type { OrgUser } from '~/schemas/orguser.schema';

export const useActiveRole = async () => {
  const { user } = useAuth();
  const { orgId } = await useCurrentOrg();
  const orgUsersService = useDataService<OrgUser>('orgusers');

  // Pull in our synchronous bucket
  const globalRole = useRoleState();

  const { data, pending, error, refresh } = await useAsyncData(
    `active-role-${orgId.value || 'none'}-${user.value?.id || 'guest'}`,
    async () => {
      if (!orgId.value || !user.value?.id) return null;

      // Direct junction lookup, scoped to the current user's resolved org —
      // avoids pulling the full Org (with all client_users expanded) just to read one role.
      const rows = await orgUsersService.getFiltered({
        filter: {
          org_id: { _eq: orgId.value },
          users_id: { _eq: user.value.id },
        },
        limit: 1,
      });

      return rows?.[0] || null;
    },
    { default: () => null }
  );

  // The current user's org_role for their current org (e.g. 'Owner' | 'Admin' | 'Member'),
  // or null if they aren't a member of any org / lookup hasn't resolved yet.
  const role = computed(() => data.value?.role || null);

  // 3. Keep the global bucket synced! 
  // If `refresh()` is called later, this automatically updates the global state.
  watchEffect(() => {
    globalRole.value = role.value;
  });


  return {
    // Current user's role string within their current organization, or null
    role,
    // True while the role lookup is in flight
    pending,
    // useAsyncData error state, if the read itself threw unexpectedly
    error,
    // Re-runs the role lookup, e.g. after a role change elsewhere
    refreshActiveRole: refresh,
  };
};
