"use client"

import { useState, useMemo } from "react";

import { useGalleryImages } from "@/hooks/useGalleryCollection";
import useMediaQuery from "@/hooks/useMediaQuery";


import ThumbnailStrip from "@/components/gallery/thumbnail-strip";
import GalleryModal from "@/components/gallery/gallery-modal";

import styles from './gallery-page.module.css';
import { rubikFont } from "@/lib/fonts";
import TornBorder from "@/components/assets/patterns/torn-border";
import { colors } from "@/lib/colors";
import ModalPortal from "@/components/ui/modal-portal";

const PAGE_SIZE = 8;

export default function GalleryPage() {
  const { data: images, loading, error } = useGalleryImages();

  const isMobile = useMediaQuery('(max-width: 767px)');
  const [activeIndex, setActiveIndex] = useState(null);
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(images.length / PAGE_SIZE);

  const pagedImages = useMemo(() => {
    return images.slice(
      page * PAGE_SIZE,
      page * PAGE_SIZE + PAGE_SIZE
    );
  }, [images, page]);

  const openModal = (index) => {
    setActiveIndex(
      isMobile ? index : page * PAGE_SIZE + index
    );
  };

  return (
    <div className={styles.page_wrapper}>
      <div className={styles.header_wrapper}>
        <h1 className={`${styles.title} ${rubikFont.className}`}>Gallery</h1>
        {isMobile && 
          <TornBorder 
            top={false} 
            color={colors.greydark2}
            mobile_view={true}
            shadow={true}
            style={{zIndex: 0}}
          />
        }
      </div>
      
      <ThumbnailStrip
        imagesCollection={
          isMobile 
          ? images 
          : pagedImages}
        loading={loading}
        openModal={openModal}
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage(p => Math.max(0, p - 1))}
        onNext={() => setPage(p => Math.min(totalPages - 1, p + 1))}
        onSetPage={setPage}
        isDesktop={!isMobile}
      />
      {activeIndex !== null && (
        <ModalPortal onClose={() => setActiveIndex(null)} fullscreen>
          <GalleryModal
            imagesCollection={images}
            loading={loading}
            activeIndex={activeIndex}
            onClose={() => setActiveIndex(null)}
          />
        </ModalPortal>
      )}
      
    </div>
  )
}
