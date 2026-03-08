export const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

export const INITIAL_TOUCHED = {
  name: false,
  email: false,
  password: false,
  passwordConfirm: false,
};

export function validateAuthForm(values, mode) {
  const errors = {};

  if (mode === "signup" && !values.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!values.email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (mode !== "forgot") {
    if (!values.password) {
      errors.password = "Please enter your password.";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    } else if (mode === "signup" && !/\d/.test(values.password)) {
      errors.password = "Password must contain at least 1 number.";
    }
  }

  if (mode === "signup") {
    if (!values.passwordConfirm) {
      errors.passwordConfirm = "Please confirm your password.";
    } else if (values.password !== values.passwordConfirm) {
      errors.passwordConfirm = "Passwords do not match.";
    }
  }

  return errors;
}

export function getTouchedAll() {
  return {
    name: true,
    email: true,
    password: true,
    passwordConfirm: true,
  };
}