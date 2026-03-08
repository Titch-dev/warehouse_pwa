import RequireRole from "@/components/dashboard/require-role";
import { USER_ROLES } from "@/lib/auth/roles";

export default function PoolPage() {
  return (
      <RequireRole allowedRoles={[USER_ROLES.CUSTOMER]}>
        <section>
          <h1>Pool</h1>
          <p>Customer pool area.</p>
        </section>
      </RequireRole>
  );
}