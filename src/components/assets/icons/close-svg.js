import * as React from "react"
const CloseSVG = ({ className, children }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 640 640" 
    className={className}
    fill="currentColor">
        <defs>
            {children}
        </defs>
    <path d="M504.6 148.5c11.3-13.6 9.5-33.8-4.1-45.1-13.6-11.3-33.8-9.5-45.1 4.1L320 270 184.6 107.5c-11.3-13.6-31.5-15.4-45.1-4.1-13.6 11.3-15.4 31.5-4.1 45.1L278.3 320 135.4 491.5c-11.3 13.6-9.5 33.8 4.1 45.1 13.6 11.3 33.8 9.5 45.1-4.1L320 370l135.4 162.5c11.3 13.6 31.5 15.4 45.1 4.1 13.6-11.3 15.4-31.5 4.1-45.1L361.7 320l142.9-171.5z" />
  </svg>
)
export default CloseSVG
