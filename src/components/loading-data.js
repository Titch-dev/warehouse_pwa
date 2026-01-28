import styles from './loading-data.module.css';
import { rubikFont } from '@/lib/fonts';

function LoadingData({ dataName }) {

  return (
    <div className={styles.loading_wrapper}>
     <div className={styles.loading_content}>
       <p className={rubikFont.className}>Loading {dataName}</p>
       <div className={styles.dots}></div>
     </div>
    </div>
  )
}

export default LoadingData