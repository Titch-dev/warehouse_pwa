import RequireRole from "@/components/dashboard/require-role";
import { USER_ROLES } from "@/lib/auth";

export default function AdminPage() {
  return (
      <RequireRole allowedRoles={[USER_ROLES.OWNER]}>
        <section>
          <h1>Owner Admin</h1>
          <p>Owner-only admin area.</p>
        </section>
      </RequireRole>
  );
}