import CmsSectionHeader from "@/components/dashboard/cms/cms-section-header";
import SpecialsForm from "@/components/dashboard/cms/specials-form";

export default function CreateSpecialPage() {
  return (
    <section>
      <CmsSectionHeader
        title="Create Special"
        description="Create a new food or drink special."
      />
      <SpecialsForm mode="create" />
    </section>
  );
}