import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserPlus } from "lucide-react"; 
import styles from "../utils/styles.js"; 
import AuthLayout from "../components/AuthLayout.jsx";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const postData = async () => {
    setLoading(true);
    const url = `${API_BASE_URL}/api/v1/auth/signup`;
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ name: name, email: email, password: password }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`${name} successfully registered`);
        setName("");
        setEmail("");
        setPassword("");
        navigate("/login");
      } else {
        toast.error(data.message || "Error creating account!");
      }
    } catch (error) {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleName = (e) => setName(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const validateForm = () => {
    if (name.trim().length < 2) {
      toast.error("Please enter your full name.");
      return false;
    } else if (!email.includes("@")) {
      toast.error("Please enter a valid developer email.");
      return false;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
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
        <h1 className="text-3xl font-extrabold tracking-tighter text-white">Start Tracking Focus</h1>
        <p className="text-sm text-zinc-400">Create your account to lock in daily consistency.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={styles.label}>Full Name</label>
          <input
            onChange={handleName}
            className={styles.input}
            value={name}
            type="text"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className={styles.label}>Developer Email</label>
          <input
            onChange={handleEmail}
            className={styles.input}
            value={email}
            type="email"
            placeholder="johndoe@example.com"
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
            placeholder="Must be at least 6 characters"
            required
          />
        </div>

        <button className={`${styles.button.primary} w-full`} type="submit" disabled={loading}>
          {loading ? "Submitting..." : <><UserPlus size={16} /> Create Developer Account</>}
        </button>
      </form>

      <div className="pt-6 text-center text-sm border-t border-zinc-800/50">
        <p className="text-zinc-500">
          Already have an account?{" "}
          <button type="button" onClick={() => navigate("/login")} className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            Log in instead
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;