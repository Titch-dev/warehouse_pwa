import CmsSectionHeader from "@/components/dashboard/cms/cms-section-header";
import MenuItemForm from "@/components/dashboard/cms/menu-item-form";

export default function CreateMenuItemPage() {
  return (
    <section>
      <CmsSectionHeader
        title="Create Menu Item"
        description="Create a new food or drink item."
      />
      <MenuItemForm mode="create" />
    </section>
  );
}