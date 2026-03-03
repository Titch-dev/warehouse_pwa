import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from './modal-portal.module.css';

function ModalPortal({ 
    children,
    onClose,
    closeOnBackdrop = true,
    fullscreen = false
}) {

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);

      document.body.classList.add('modal-open');

      const handleEsc = (e) => {
        if (e.key === 'Escape') onClose?.();
      };

      window.addEventListener('keydown', handleEsc);

      return () => {
        document.body.classList.remove('modal-open');
        window.removeEventListener('keydown', handleEsc);
      };
    }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={`${styles.modal} ${fullscreen ? styles.fullscreen : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

export default ModalPortal