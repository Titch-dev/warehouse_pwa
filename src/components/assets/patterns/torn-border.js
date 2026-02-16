import TornBorderMobSVG from "./torn-border-mobile";
import TornBorderTabSVG from "./torn-border-tablet";
import styles from "./torn-border.module.css";

export default function TornBorder({top=true, color, mobile_view=false, shadow=false}) {
    
  return (
    <>
        <TornBorderMobSVG 
            className={
                `${styles.border} 
                ${styles.mobile} 
                ${!top ? styles.bottom : styles.top}
                ${shadow ? styles.shadow : ''}`
            }
            color={color}
        />
        <TornBorderTabSVG 
            className={
                `${styles.border}
                ${styles.desktop}
                ${!top ? styles.bottom : styles.top}
                ${mobile_view ? styles.mobile_only : undefined}
                ${shadow ? styles.shadow : ''}`
            }
            color={color}
        />
    </>
  )
}
