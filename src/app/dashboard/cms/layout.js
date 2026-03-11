import RequireRole from "@/components/dashboard/require-role";
import CmsShell from "@/components/dashboard/cms/cms-shell";
import { USER_ROLES } from "@/lib/auth";

export default function CmsLayout({ children }) {
  return (
    <RequireRole allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.OWNER]}>
      <CmsShell>{children}</CmsShell>
    </RequireRole>
  );
}