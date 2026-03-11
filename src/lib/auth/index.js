export { getFirebaseErrorMessage } from "@/lib/auth/auth-errors";
export { 
    INITIAL_FORM, 
    INITIAL_TOUCHED, 
    validateAuthForm, 
    getTouchedAll 
} from "@/lib/auth/auth-form-validation";
export { googleProvider } from "@/lib/auth/auth-providers";
export { 
    signInWithEmail, 
    signUpWithEmail, 
    sendResetPasswordEmail, 
    signInWithGooglePopup 
} from "@/lib/auth/auth-service";
export {
    USER_ROLES,
    ROLE_HOME,
    ROLE_NAV,
    hasRequiredRole
} from "@/lib/auth/roles";