'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import styles from './toast.module.css';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }) {
  const [message, setMessage] = useState(null);

  const showToast = useCallback((msg, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div className={styles.toast}>
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}