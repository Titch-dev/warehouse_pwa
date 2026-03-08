import RequireRole from "@/components/dashboard/require-role";
import { USER_ROLES } from "@/lib/auth/roles";

export default function MembershipPage() {
  return (
      <RequireRole allowedRoles={[USER_ROLES.CUSTOMER]}>
        <section>
          <h1>Membership</h1>
          <p>Customer membership area.</p>
        </section>
      </RequireRole>
  );
}