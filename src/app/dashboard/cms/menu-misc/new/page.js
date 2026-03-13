import CmsSectionHeader from "@/components/dashboard/cms/cms-section-header";
import MenuMiscForm from "@/components/dashboard/cms/menu-misc-form";

export default function CreateMenuMiscPage() {
  return (
    <section>
      <CmsSectionHeader
        title="Create Menu Misc"
        description="Create an extras group or notice."
      />
      <MenuMiscForm mode="create" />
    </section>
  );
}