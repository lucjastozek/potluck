import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import styles from "./AuthForm.module.css";

interface FieldErrors {
  username?: string;
  displayName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const USERNAME_RE = /^[a-z0-9_]{3,32}$/;

function validate(
  username: string,
  displayName: string,
  email: string,
  password: string,
  confirmPassword: string,
): FieldErrors {
  const errors: FieldErrors = {};

  if (!username) {
    errors.username = "Username is required";
  } else if (!USERNAME_RE.test(username)) {
    errors.username =
      "3–32 characters: lowercase letters, numbers, underscores only";
  }

  if (!displayName.trim()) {
    errors.displayName = "Display name is required";
  } else if (displayName.trim().length < 2) {
    errors.displayName = "Must be at least 2 characters";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Must be at least 8 characters";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords don't match";
  }

  return errors;
}

export default function SignUpPage(): JSX.Element {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    const errors = validate(
      username,
      displayName,
      email,
      password,
      confirmPassword,
    );
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      await register(email, password, displayName.trim(), username);
      navigate("/feed", { replace: true });
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div>
          <h1 className={styles.heading}>Create account</h1>
          <p className={styles.subheading}>Get started — it's free</p>
        </div>

        {globalError && <p className={styles.globalError}>{globalError}</p>}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className={`${styles.input} ${fieldErrors.username ? styles.error : ""}`}
              placeholder="jane_doe"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              autoComplete="username"
              spellCheck={false}
              disabled={isSubmitting}
            />
            {fieldErrors.username ? (
              <span className={styles.fieldError}>{fieldErrors.username}</span>
            ) : (
              <span className={styles.fieldHint}>
                Letters, numbers, underscores. Can't be changed later.
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="displayName">
              Display name
            </label>
            <input
              id="displayName"
              type="text"
              className={`${styles.input} ${fieldErrors.displayName ? styles.error : ""}`}
              placeholder="Jane Doe ✨"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="name"
              disabled={isSubmitting}
            />
            {fieldErrors.displayName && (
              <span className={styles.fieldError}>
                {fieldErrors.displayName}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`${styles.input} ${fieldErrors.email ? styles.error : ""}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={isSubmitting}
            />
            {fieldErrors.email && (
              <span className={styles.fieldError}>{fieldErrors.email}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`${styles.input} ${fieldErrors.password ? styles.error : ""}`}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            {fieldErrors.password && (
              <span className={styles.fieldError}>{fieldErrors.password}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`${styles.input} ${fieldErrors.confirmPassword ? styles.error : ""}`}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            {fieldErrors.confirmPassword && (
              <span className={styles.fieldError}>
                {fieldErrors.confirmPassword}
              </span>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting && <span className={styles.spinner} />}
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
