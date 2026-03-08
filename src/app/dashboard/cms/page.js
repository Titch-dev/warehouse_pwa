import RequireRole from "@/components/dashboard/require-role";
import { USER_ROLES } from "@/lib/auth/roles";

export default function CmsPage() {
  return (
      <RequireRole allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.OWNER]}>
        <section>
          <h1>CMS</h1>
          <p>Admin content management area.</p>
        </section>
      </RequireRole>
  );
}