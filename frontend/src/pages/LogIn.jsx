import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-toastify";
import { LogIn as LoginIcon } from "lucide-react"; 
import 'react-toastify/dist/ReactToastify.css';
import styles from "../utils/styles.js"; 
import AuthLayout from "../components/AuthLayout.jsx"; 

const LogIn = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const postData = async () => {
    setLoading(true);
    const url = `${API_BASE_URL}/auth/login`;
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ email: email, password: password }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });

      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        const user = data.user;
        const token = data.token;
        login(user, token);
        setEmail("");
        setPassword("");
        toast.success("Log In Successful!");
        navigate("/app");
      } else {
        toast.error("Error logging in!");
      }
    } catch (error) {
      console.error("Error: ", error);
      setLoading(false);
      alert("Error occurred!");
    }
  };

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const validateForm = () => {
    if (!email.includes("@")) {
      toast.error("Invalid Credentials!");
      return false;
    } else if (password.length < 6) {
      toast.error("Invalid Credentials!");
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await postData();
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tighter text-white">Welcome Back</h1>
        <p className="text-sm text-zinc-400">Log in to view your metrics and history.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={styles.label}>Email Address</label>
          <input
            onChange={handleEmail}
            className={styles.input}
            value={email}
            type="email"
            placeholder="dev@momentum.io"
            required
          />
        </div>

        <div>
          <label className={styles.label}>Password</label>
          <input
            onChange={handlePassword}
            className={styles.input}
            value={password}
            type="password"
            placeholder="••••••••••••"
            required
          />
        </div>

        <button className={`${styles.button.primary} w-full`} type="submit" disabled={loading}>
          {loading ? "Logging in..." : <><LoginIcon size={16} /> Access Dashboard</>}
        </button>
      </form>

      <div className="pt-6 text-center text-sm border-t border-zinc-800/50">
        <p className="text-zinc-500">
          Don't have an account?{" "}
          <button type="button" onClick={() => navigate("/register")} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            Register now
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LogIn;