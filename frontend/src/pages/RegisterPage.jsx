import "../styles/auth.css";
import { userRegister } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useActionState , useEffect } from "react";
import { useFormStatus } from "react-dom";

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

  async function registerAction(previousState, formData) {
  try {
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    await userRegister(userData);

    return {
      success: true,
      message: "Registration successful. Redirecting to login...",
    };
  } catch (error) {
    return {
      success: false,
      message: "Registration failed",
    };
  }
}
 const [state, formAction] = useActionState(
    registerAction,
    {
      success: false,
      message: "",
    }
  )

  useEffect(() => {
  if (state.success) {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }
}, [state.success, navigate]);


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>

        <form action={formAction}>
          <input
            type="text"
            name="name"
            placeholder="Name"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
          />

          <input
            type="password"
             name="confirmPassword"
            placeholder="Confirm Password"
          />

          <RegisterButton />
        </form>

        {state.success && (
          <div className="success-message">
            Registration successful! Redirecting to login...
          </div>
        )}

        {!state.success && state.message && (
          <div className="error-message">
            {state.message}
          </div>
        )}

        <p>
          Already have an account?
          <a href="/login"> Login</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;