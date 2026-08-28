import "../styles/auth.css";
import { userLogin } from "../services/api";
import { useActionState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormStatus } from "react-dom";

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Loging..." : "Login"}
    </button>
  );
}

function LoginPage() {
  const navigate = useNavigate();

  
async function loginAction(previousState, formData) {
  try {
    const userData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const data = await userLogin(userData);
    localStorage.setItem("access_token", data.access_token);

    return {
      success: true,
      message: "Login successful! Redirecting to chat...",
      token: data.access_token,
    };
  } catch (error) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }
}

const [state, formAction] = useActionState(
  loginAction,
  {
    success: false,
    message: "",
  }
);

useEffect(() => {
  if (state.success) {
    const timer = setTimeout(() => {
      navigate("/chat");
    }, 5000);

    return () => clearTimeout(timer);
  }
}, [state.success, navigate]);


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>

        <form action={formAction}>
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

         <LoginButton/>
        </form>

        {state.message && (
          <div className={state.success ? "success-message" : "error-message"}>
            {state.message}
          </div>
        )}

        <p>
          Don't have an account?
          <a href="/register"> Register</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;