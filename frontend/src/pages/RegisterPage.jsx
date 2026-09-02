import "../styles/auth.css";
import { userRegister } from "../services/api";
import { useNavigate,Link } from "react-router-dom";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import PasswordChecklist, { PASSWORD_RULES } from "../components/PasswordChecklist";

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

  async function registerAction(previousState, formData) {
    try {
      const userData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      };

      const confirmPassword = formData.get("confirmPassword");

      const failedRule = PASSWORD_RULES.find((rule) => !rule.test(userData.password));
      if (failedRule) {
        return {
          success: false,
          message: failedRule.label + " is required",
        };
      }

      if (userData.password !== confirmPassword) {
        return {
          success: false,
          message: "Passwords do not match",
        };
      }

      await userRegister(userData);

      return {
        success: true,
        message: "Registration successful. Redirecting to login...",
      };
    } catch (error) {
      if(error.response?.status==400){
      return {
        success:false,
        emailError:"Email is already registered, Redirecting to Login Page"
      }
    }
      return {
        success: false,
        message: error.response?.data?.detail || "Registration failed",
      };
    }
    
  }

  const [state, formAction] = useActionState(registerAction, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
    if(state.emailError){
      const timer=setTimeout(()=>{
        navigate("/login")
    },2000); 
    return()=>clearTimeout(timer);
    } 
  }, [state.success,state.emailError, navigate]);

const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
const showMatchStatus = confirmPassword.length > 0;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>

        <form action={formAction}>
          <input type="text" name="name" placeholder="Name" />

          <input type="email" name="email" placeholder="Email" />

         <div className="password-wrapper">
           <input
            type={showpassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showpassword)} 
            >{showpassword ?  "👁️" : "👁️‍🗨️"}</button>       
          </div>

          <PasswordChecklist password={password} />

          <div className="password-wrapper">
        <input
          type={showpassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
          <button
            type="button"
            onClick={() => setShowPassword(!showpassword)} 
            >{showpassword ?  "👁️" : "👁️‍🗨️"}</button>       
          </div>
          {showMatchStatus && (
          <p className={passwordsMatch ? "match-success" : "match-error"}>
            {passwordsMatch ? "Passwords match" : "Passwords do not match"}
          </p>
        )}

          <RegisterButton />
        </form>

        {state.success && (
          <div className="success-message">
            Registration successful! Redirecting to login...
          </div>
        )}
        {
          state.emailError &&
          <div className="error-message">
            {state.emailError}
          </div>  
        }

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