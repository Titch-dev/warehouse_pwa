"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "./login-page.module.css";
import { rubikFont } from "@/theme/fonts";
import GoogleSVG from "@/components/assets/icons/google-svg";
import EyeOpenSVG from "@/components/assets/icons/eye-open-svg";
import EyeClosedSVG from "@/components/assets/icons/eye-closed-svg";

import {
  signInWithEmail,
  signUpWithEmail,
  sendResetPasswordEmail,
  signInWithGooglePopup,
  INITIAL_FORM,
  INITIAL_TOUCHED,
  validateAuthForm,
  getTouchedAll,
  getFirebaseErrorMessage
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextUrl = useMemo(() => {
    const n = searchParams.get("next");
    return n && n.startsWith("/") ? n : "/dashboard";
  }, [searchParams]);

  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState(INITIAL_FORM);
  const [touched, setTouched] = useState(INITIAL_TOUCHED);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";
  const isSignin = mode === "signin";

  const errors = validateAuthForm(form, mode);
  const showError = (field) => touched[field] && errors[field];

  function handleChange(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleBlur(field) {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  }

  function resetView(nextMode) {
    setMode(nextMode);
    setError("");
    setMessage("");
    setTouched(INITIAL_TOUCHED);
    setShowPassword(false);

    setForm((prev) => ({
      ...INITIAL_FORM,
      email: prev.email,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    setTouched(getTouchedAll());

    const currentErrors = validateAuthForm(form, mode);
    if (Object.keys(currentErrors).length > 0) return;

    setLoading(true);

    try {
      if (isSignin) {
        await signInWithEmail({
          email: form.email,
          password: form.password,
        });

        router.replace(nextUrl);
        return;
      }

      if (isSignup) {
        await signUpWithEmail({
          name: form.name,
          email: form.email,
          password: form.password,
        });

        router.replace(nextUrl);
        return;
      }

      if (isForgot) {
        await sendResetPasswordEmail(form.email);
        setMessage("Password reset email sent. Check your inbox.");
      }
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await signInWithGooglePopup();
      router.replace(nextUrl);
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={`${styles.title} ${rubikFont.className}`}>
          {isSignin && "Sign in"}
          {isSignup && "Create account"}
          {isForgot && "Reset password"}
        </h1>

        <form onSubmit={handleSubmit} className={styles.form_layout}>
          {isSignup && (
            <label className={styles.label}>
              <span>Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                className={showError("name") ? styles.input_error : ""}
                autoComplete="name"
              />
              {showError("name") && (
                <p className={styles.error_text}>{errors.name}</p>
              )}
            </label>
          )}

          <label className={styles.label}>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              className={showError("email") ? styles.input_error : ""}
              autoComplete="email"
            />
            {showError("email") && (
              <p className={styles.error_text}>{errors.email}</p>
            )}
          </label>

          {!isForgot && (
            <label className={styles.label}>
              <span>Password</span>
              <div className={styles.password_wrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={showError("password") ? styles.input_error : ""}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={styles.password_toggle}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeClosedSVG /> : <EyeOpenSVG />}
                </button>
              </div>
              {showError("password") && (
                <p className={styles.error_text}>{errors.password}</p>
              )}
            </label>
          )}

          {isSignup && (
            <label className={styles.label}>
              <span>Confirm password</span>
              <input
                type={showPassword ? "text" : "password"}
                value={form.passwordConfirm}
                onChange={(e) =>
                  handleChange("passwordConfirm", e.target.value)
                }
                onBlur={() => handleBlur("passwordConfirm")}
                className={
                  showError("passwordConfirm") ? styles.input_error : ""
                }
                autoComplete="new-password"
              />
              {showError("passwordConfirm") && (
                <p className={styles.error_text}>{errors.passwordConfirm}</p>
              )}
            </label>
          )}

          {error && <div className={styles.form_error}>{error}</div>}
          {message && <div className={styles.form_success}>{message}</div>}

          <button
            disabled={loading}
            type="submit"
            className={styles.submit_button}
          >
            {loading
              ? "Please wait..."
              : isSignin
                ? "Sign in"
                : isSignup
                  ? "Create account"
                  : "Send reset email"}
          </button>

          {!isForgot && (
            <button
              type="button"
              className={styles.social_auth}
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <GoogleSVG className={styles.icon}>
                <linearGradient id="loginGrad" x2="0" y2="1">
                  <stop className={styles.stop1} offset="0%" />
                  <stop className={styles.stop2} offset="50%" />
                  <stop className={styles.stop3} offset="100%" />
                </linearGradient>
              </GoogleSVG>
              <p>{loading ? "Please wait..." : "Continue with Google"}</p>
            </button>
          )}
        </form>

        <div className={styles.mode_actions}>
          {!isSignin && (
            <button
              type="button"
              onClick={() => resetView("signin")}
              className={styles.text_button}
            >
              Back to sign in
            </button>
          )}

          {isSignin && (
            <>
              <button
                type="button"
                onClick={() => resetView("forgot")}
                className={styles.text_button}
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={() => resetView("signup")}
                className={styles.text_button}
              >
                Need an account? Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}