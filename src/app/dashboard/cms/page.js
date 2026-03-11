import CmsSectionHeader from "@/components/dashboard/cms/cms-section-header";

export default function CmsPage() {
  return (
    <section>
      <CmsSectionHeader
        title="CMS"
        description="Admin content management area. Choose a section to manage your site content."
      />

      <p>
        Use the navigation to manage events, menu items, specials, and gallery
        content.
      </p>
    </section>
  );
}