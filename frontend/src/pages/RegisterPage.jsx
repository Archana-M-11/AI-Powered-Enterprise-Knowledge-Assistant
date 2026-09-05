import "../styles/auth.css";
import { userRegister } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { PASSWORD_RULES } from "../components/PasswordChecklist";
import toast from "react-hot-toast";

function RegisterButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Registering..." : "Register"}
    </button>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showpassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clearedFields, setClearedFields] = useState({});

  async function registerAction(previousState, formData) {
    const name = formData.get("name")?.trim();
    const email = formData.get("email")?.trim();
    const pw = formData.get("password");
    const confirmPw = formData.get("confirmPassword");

    const errors = {};
    const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    if (!name) {
        errors.nameError = "Name is required";
      } else if (!nameRegex.test(name)) {
        errors.nameError = "Name should contain only letters";
      }
    if (!email) errors.emailValidationError = "Email is required";

    if (!pw) {
      errors.passwordError = "Password is required";
    } else {
      const failedRules = PASSWORD_RULES.filter((rule) => !rule.test(pw));
      if (failedRules.length > 0) {
        errors.passwordError = "Missing: " + failedRules.map((r) => r.label).join(", ");
      }
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, message: "", ...errors };
    }

    try {
      await userRegister({ name, email, password: pw });
      return { success: true, message: "Registration successful. Redirecting to login..." };
    } catch (error) {
      if (error.response?.status == 400) {
        return {
          success: false,
          emailError: "Email is already registered, Redirecting to Login Page",
        };
      }
      return { success: false, message: error.response?.data?.detail || "Registration failed" };
    }
  }

  const [state, formAction] = useActionState(registerAction, {
    success: false,
    message: "",
    nameError: "",
    emailError: "",
    emailValidationError: "",
    passwordError: "",
    confirmPasswordError: "",
  });

  useEffect(() => {
    setClearedFields({});
  }, [state]);

 useEffect(() => {
  if (state.success || state.emailError) {
    if (state.success) {
      toast.success(state.message || "Registration successful. Redirecting to login...");
    } else {
      toast.error(state.emailError);
    }

    const timer = setTimeout(() => navigate("/login"), 2000);
    return () => clearTimeout(timer);
  }

}, [state.success, state.emailError, navigate]);

  const clearField = (field) => setClearedFields((prev) => ({ ...prev, [field]: true }));

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const showMatchStatus = confirmPassword.length > 0;
  useEffect(() => {
  if (!state.success && (
    state.nameError ||
    state.emailValidationError ||
    state.passwordError ||
    state.confirmPasswordError ||
    state.message
  )) {
    setPassword("");
    setConfirmPassword("");
  }
}, [state]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>

        <form action={formAction}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={() => clearField("nameError")}
          />
          {!clearedFields.nameError && state.nameError && (
            <div className="error-message">{state.nameError}</div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={() => clearField("emailValidationError")}
          />
          {!clearedFields.emailValidationError && state.emailValidationError && (
            <div className="error-message">{state.emailValidationError}</div>
          )}

          <div className="password-wrapper">
            <input
              type={showpassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearField("passwordError");
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showpassword)}
            >{showpassword ? "👁️" : "👁️‍🗨️"}</button>
          </div>
          {!clearedFields.passwordError && state.passwordError && (
            <div className="error-message">{state.passwordError}</div>
          )}

          <div className="password-wrapper">
            <input
              type={showpassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearField("confirmPasswordError");
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showpassword)}
            >{showpassword ? "👁️" : "👁️‍🗨️"}</button>
          </div>
          {showMatchStatus && (
            <p className={passwordsMatch ? "match-success" : "match-error"}>
              {passwordsMatch ? " " : "Passwords do not match"}
            </p>
          )}
          {!clearedFields.confirmPasswordError && state.confirmPasswordError && (
            <div className="error-message">{state.confirmPasswordError}</div>
          )}

          <RegisterButton />
        </form>

        {state.success && (
          <div className="success-message">
            Registration successful! Redirecting to login...
          </div>
        )}

        {!state.success && state.message && (
          <div className="error-message">{state.message}</div>
        )}

        <p>
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;