import TornBorderMobSVG from "./torn-border-mobile";
import TornBorderTabSVG from "./torn-border-tablet";
import styles from "./torn-border.module.css";

export default function TornBorder({top, color, mobile_view=false}) {
    
  return (
    <>
        <TornBorderMobSVG 
            className={
                `${styles.border} 
                ${styles.mobile} 
                ${top===false ? styles.bottom : styles.top}`
            }
            color={color}
        />
        <TornBorderTabSVG 
            className={
                `${styles.border}
                ${styles.desktop}
                ${top===false ? styles.bottom : styles.top}
                ${mobile_view===true ? styles.mobile_only : undefined}`
            }
            color={color}
        />
    </>
  )
}
