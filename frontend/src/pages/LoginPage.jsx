import "../styles/auth.css";

function LoginPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>

        <form>
          <input
            type="email"
            placeholder="Email"
          />

          <input
            type="password"
            placeholder="Password"
          />

          <button type="submit">
            Login
          </button>
        </form>

        <p>
          Don't have an account?
          <a href="/register"> Register</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;