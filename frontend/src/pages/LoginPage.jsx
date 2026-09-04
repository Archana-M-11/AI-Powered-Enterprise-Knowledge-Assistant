import "../styles/auth.css";
import { userLogin } from "../services/api";
import { useActionState,useEffect,useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";

function LoginButton() {
  const { pending } = useFormStatus();


  return (
    <button  type="submit" disabled={pending}>
      {pending ? "Loging..." : "Login"}
    </button>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const[showpassword,setShowPassword]=useState(false);

  
async function loginAction(previousState, formData) {
  
  const email = formData.get("email")?.trim();
  const password = formData.get("password");

 
   const errors = {};

  if (!email) {
    errors.emailError = "Email is required";
  }

  if (!password) {
    errors.passwordError = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      emailError: errors.emailError || "",
      passwordError: errors.passwordError || "",
      message: "",
    };
  }
 
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
    if (error.response?.status==404){
      return{
        notRegistered:true,
        success:false,
        message:"Email is not registered, Redirecting to Register Page"
      }
    }
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
    notRegistered:false,
    emailError: "",
    passwordError: "",
    message: "",
  }
);

useEffect(() => {
  if (state.success) {
    toast.success(state.message || "Login successful! Redirecting...");
    const timer = setTimeout(() => {
      navigate("/chat");
    }, 2000);

    return () => clearTimeout(timer);
  }
  if(state.notRegistered){
    toast.error(state.message || "Email is not registered, redirecting...");
    const timer=setTimeout(()=>{
      navigate("/register")
  },2000);
  return()=>clearTimeout(timer);
  }
}, [state.success,state.notRegistered, navigate]);



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
          {
            state.emailError &&
            <div className="error-message">
              {state.emailError}
            </div>
          }
         <div className="password-wrapper">
           <input
            type={showpassword ? "text" : "password"}
            name="password"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showpassword)} 
            >{showpassword ?  "👁️" : "👁️‍🗨️"}</button>       
          </div>
          {
            state.passwordError &&
            <div>
              <div className="error-message">
                {state.passwordError}
              </div>
            </div>
          }
          {!state.success && !state.passwordError && state.message && (
            <div className="error-message">{state.message}</div>
          )}

         <LoginButton/>
        </form>

        <p>
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;