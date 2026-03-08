import RequireRole from "@/components/dashboard/require-role";
import { USER_ROLES } from "@/lib/auth/roles";

export default function PoolLivePage() {
  return (
      <RequireRole allowedRoles={[USER_ROLES.STAFF, USER_ROLES.OWNER]}>
        <section>
          <h1>Pool Live</h1>
          <p>Staff live session area.</p>
        </section>
      </RequireRole>
  );
}