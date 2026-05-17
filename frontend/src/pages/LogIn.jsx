import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

const LogIn = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const postData = async () => {
    setLoading(true);
    const url = "http://localhost:3000/auth/login";
    try {
      const response = await fetch(url, {
        method: "POST",

        body: JSON.stringify({
          email: email,
          password: password,
        }),

        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        console.log("response:", response);

        const user = data.user;
        const token = data.token;
        console.log(user);

        login(user, token);
        console.log("Logging in:", user);
       
        setEmail("");
        setPassword("");
        toast.success("Log In Successfull!");
        navigate("/app");
      } else {
     
        toast.error("Error logging in!");
      }
    } catch (error) {
      console.error("Error: ", error);
      setLoading(false);
      alert("Error occured!");
    }
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);

  };

  const handlePassword = (e) => {
    setPassword(e.target.value);

  };

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
    <div className="form">
      <div>
        <h1>User Registration</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="label">Email</label>
        <input
          onChange={handleEmail}
          className="input"
          value={email}
          type="email"
        />

        <label className="label">Password</label>
        <input
          onChange={handlePassword}
          className="input"
          value={password}
          type="password"
        />

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default LogIn;
