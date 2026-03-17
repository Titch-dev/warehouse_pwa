import CmsSectionHeader from "@/components/dashboard/cms/cms-section-header";
import GalleryForm from "@/components/dashboard/cms/gallery-form";

export default function CreateGalleryItemPage() {
  return (
    <section>
      <CmsSectionHeader
        title="Upload Gallery Images"
        description="Upload one or more gallery images."
      />
      <GalleryForm mode="create" />
    </section>
  );
}