import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const LogIn = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const postData = async () => {
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

      if (response.ok) {
        console.log(response.ok);
        
        const user = data.user;
        const token = data.token
        console.log(user);

        login(user, token);
        console.log("Logging in:", user);

        // localStorage.setItem("token", data.token);
        // localStorage.setItem("user", JSON.stringify(user));
        setErrorMessage("");
        setEmail("");
        setPassword("");
        navigate("/app");
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Error: ", error);
      alert("Error occured!");
    }
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrorMessage("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrorMessage("");
  };

  const validateForm = () => {
    if (!email.includes("@")) {
      setErrorMessage("Invalid Credentials!");
      return false;
    } else if (password.length < 6) {
      setErrorMessage("Invalid Credentials!");
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

      <div className="messages">{errorMessage}</div>

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

        <button className="btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default LogIn;
